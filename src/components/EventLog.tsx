import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import useGameStore from '../store/gameStore';

type ParsedEvent = {
  raw: string;
  dateStr?: string; // original date text
  year?: string;
  icon?: string;
  title: string;
  subtitle?: string;
};

function parseEvent(raw: string): ParsedEvent {
  // Expecting strings like "09/10/2025: Advanced to age 19. Money change: 795"
  const parts = raw.split(':');
  let dateStr: string | undefined = undefined;
  let body = raw;
  if (parts.length >= 2) {
    dateStr = parts[0].trim();
    body = parts.slice(1).join(':').trim();
  }

  const res: ParsedEvent = { raw, dateStr, title: body };

  // extract year safely from date string (MM/DD/YYYY or similar)
  if (dateStr) {
    const dparts = dateStr.split('/');
    if (dparts.length === 3) {
      res.year = dparts[2];
    } else if (dateStr.length >= 4) {
      res.year = dateStr.slice(-4);
    }
  }

  // Patterns
  const advMatch = /Advanced to age (\d+)\.\s*Money change:?\s*([+-]?\d+)/i.exec(body);
  if (advMatch) {
    const age = advMatch[1];
    const delta = Number(advMatch[2]);
    const sign = delta >= 0 ? `+${delta}` : `-${Math.abs(delta)}`;
    res.icon = '🎂';
    res.title = `Reached Age ${age}`;
    res.subtitle = `${delta >= 0 ? 'Gained' : 'Lost'} $${Math.abs(delta)} (${sign})`;
    return res;
  }

  const partTimeMatch = /Took a part-time job and earned (\d+)/i.exec(body);
  if (partTimeMatch) {
    const earn = Number(partTimeMatch[1]);
    res.icon = '💼';
    res.title = `Part-time job`;
    res.subtitle = `Earned $${earn}`;
    return res;
  }

  const investMatch = /Invested in stocks\. Change:?\s*([+-]?\d+)/i.exec(body);
  if (investMatch) {
    const delta = Number(investMatch[1]);
    res.icon = '📈';
    res.title = `Invested in stocks`;
    res.subtitle = `${delta >= 0 ? 'Gained' : 'Lost'} $${Math.abs(delta)}`;
    return res;
  }

  const promoMatch = /Applied for promotion\. Received (\d+)/i.exec(body);
  if (promoMatch) {
    const amt = Number(promoMatch[1]);
    res.icon = '📝';
    res.title = `Applied for promotion`;
    res.subtitle = `Received $${amt}`;
    return res;
  }

  if (/Visited doctor/i.test(body)) {
    res.icon = '🩺';
    res.title = `Visited doctor`;
    res.subtitle = 'Health improved';
    return res;
  }

  if (/Went to the gym/i.test(body)) {
    res.icon = '🏋️';
    res.title = `Went to the gym`;
    res.subtitle = 'Health slightly improved';
    return res;
  }

  if (/Planned a date/i.test(body)) {
    res.icon = '💘';
    res.title = `Planned a date`;
    res.subtitle = 'Relationship improved';
    return res;
  }

  const ignoredMatch = /Ignored suggestion: (.+)/i.exec(body);
  if (ignoredMatch) {
    res.icon = '🚫';
    res.title = `Ignored: ${ignoredMatch[1]}`;
    return res;
  }

  // Fallback: show the body as-is with a generic icon
  res.icon = '📜';
  res.title = body;
  return res;
}

export default function EventLog({ maxHeight = 560 }: { maxHeight?: number }) {
  const eventLog = useGameStore((s) => s.eventLog);
  const scrollRef = useRef<ScrollView | null>(null);
  const [showJump, setShowJump] = useState(false);

  const onScroll = (e: any) => {
    // show the button when user has scrolled away from the top
    const y = e.nativeEvent.contentOffset.y;
    setShowJump(y > 50);
  };

  // reverse so newest appear first, then parse and group by year
  const grouped = useMemo(() => {
    const arr = [...eventLog].reverse();
    const parsed = arr.map((r) => parseEvent(r));
    const map: Record<string, ParsedEvent[]> = {};
    parsed.forEach((p) => {
      const year = p.year ?? 'Other';
      if (!map[year]) map[year] = [];
      map[year].push(p);
    });
    // maintain descending year order when possible
    const years = Object.keys(map).sort((a, b) => (a === 'Other' ? 1 : b === 'Other' ? -1 : Number(b) - Number(a)));
    return { map, years } as { map: Record<string, ParsedEvent[]>; years: string[] };
  }, [eventLog]);

  return (
    <View style={[styles.container, { maxHeight }] }>
      <ScrollView ref={scrollRef} onScroll={onScroll} scrollEventThrottle={100} contentContainerStyle={styles.content} nestedScrollEnabled={true} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled">
        {eventLog.length === 0 ? (
          <Text style={styles.placeholder}>Your life story will appear here...</Text>
        ) : (
          grouped.years.map((y) => (
            <View key={y} style={styles.yearGroup}>
              <Text style={styles.yearHeader}>{y === 'Other' ? '' : y}</Text>
              {grouped.map[y].map((e, i) => (
                <View key={`${y}-${i}`} style={styles.eventCard}>
                  <View style={styles.eventIconWrap}>
                    <Text style={styles.eventIcon}>{e.icon}</Text>
                  </View>
                  <View style={styles.eventBody}>
                    <Text style={styles.eventTitle}>{e.title}</Text>
                    {e.subtitle ? <Text style={styles.eventSubtitle}>{e.subtitle}</Text> : null}
                    {e.dateStr ? <Text style={styles.eventDate}>{e.dateStr}</Text> : null}
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
      {showJump ? (
        <TouchableOpacity
          style={styles.jumpButton}
          onPress={() => {
            // scroll to top (newest)
            if (scrollRef.current) (scrollRef.current as any).scrollTo({ y: 0, animated: true });
            setShowJump(false);
          }}
        >
          <Text style={styles.jumpButtonText}>Newest</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 12 },
  placeholder: { color: '#666', fontSize: 14, textAlign: 'center', marginTop: 24 },
  yearGroup: { marginBottom: 8 },
  yearHeader: { fontWeight: '700', color: '#333', marginBottom: 6 },
  eventCard: { flexDirection: 'row', padding: 10, marginBottom: 8, backgroundColor: '#f7f7f7', borderRadius: 8, alignItems: 'center' },
  eventIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 10, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4 },
  eventIcon: { fontSize: 18 },
  eventBody: { flex: 1 },
  eventTitle: { color: '#111', fontSize: 14, fontWeight: '600' },
  eventSubtitle: { color: '#4b5563', fontSize: 13, marginTop: 2 },
  eventDate: { color: '#9ca3af', fontSize: 12, marginTop: 4 },
  jumpButton: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    backgroundColor: '#2b8cff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
  },
  jumpButtonText: { color: '#fff', fontWeight: '700' },
});
