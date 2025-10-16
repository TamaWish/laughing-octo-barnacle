# **Primary Education Catalog (Status 0 → Status 1\)**

This catalog defines the compulsory primary education phase for all Sims, establishing the baseline for the "Smarts" stat and granting **Status 1: Primary School Graduate**.

The core mechanics are:

1. **Automatic Enrollment:** Enrollment begins automatically when a Sim turns the listed starting age (usually 5 or 6).  
2. **Stat Progression:** The Sim receives small, regular increases to their **Smarts** and **Happiness** stats throughout this phase.  
3. **Completion:** Upon reaching the end age, the Sim automatically graduates, earns **Status 1**, and automatically enrolls into the next tier (Secondary School/High School equivalent).

## **Country-Specific Primary School Definitions**

| Country Code | Primary School Name (English Translation) | Start Age | End Age | Duration (Years) | Key Feature/Gameplay Context |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **🇺🇸 US** | Elementary School | 6 | 11 | 5 | Emphasis on foundational reading and mathematics skills. |
| **🇬🇧 GB** | Primary School (Key Stages 1 & 2\) | 5 | 11 | 6 | Leads to the mandatory Key Stage 3 (Secondary School) at age 11\. |
| **🇨🇦 CA** | Elementary School (or Primary School) | 6 | 12 | 6 | Provincial curriculum focus, often includes early French immersion opportunities. |
| **🇦🇺 AU** | Primary School | 5 | 12 | 7 | The longest typical duration; includes preparatory year before Year 1\. |
| **🇯🇵 JP** | Shōgakkō (小学校) | 6 | 12 | 6 | High emphasis on manners, discipline, and communal responsibility. |
| **🇮🇳 IN** | Primary School (Standard I-V) | 6 | 11 | 5 | Focus is on national curriculum basics and preparation for competitive exams later. |
| **🇩🇪 DE** | Grundschule | 6 | 10 | 4 | Shortest compulsory primary phase. Graduation results in the critical decision of which secondary path (Gymnasium, Realschule, etc.) the Sim is guided toward based on performance. |
| **🇫🇷 FR** | École Primaire | 6 | 11 | 5 | Focus on comprehensive literacy and numeracy, paving the way for Collège. |

## **Primary School Name Catalog (for In-Game Events & Flavor)**

| Country Code | Public School Name Options (Randomly Chosen) | Private School Name Options (Higher Cost, Higher Stat Chance) |
| :---- | :---- | :---- |
| **🇺🇸 US** | Riverbend Elementary, Lincoln Heights School, Maplewood Primary, George Washington Academy | St. Jude's Catholic School, The Montessori Prep, Westlake Day School, Trinity Classical School |
| **🇬🇧 GB** | Hollybush Primary School, St. George's C of E School, Willow Tree Academy, Crown Lane Junior School | London Prep School, The King’s Foundation, Eton House Primary, Wycombe Abbey Junior |
| **🇨🇦 CA** | Willowdale Public School, École Saint-Jacques, Deer Park Elementary, Cedarbrae Primary | Upper Canada College Junior, Bishop Strachan School (Primary), Toronto French School, St. Clement's School |
| **🇦🇺 AU** | Glebe Public School, North Shore Primary, Brighton State School, Melbourne East Primary | Sydney Grammar Prep, Shore School Junior, Ascham School (Primary), Geelong Grammar School |
| **🇯🇵 JP** | Shinjuku Dai-ichi Shōgakkō, Tōkyō Metropolitan Primary, Meiji Primary School, Asahi Higashi School | Keio Yochisha Primary School, Gakushuin Primary School, Seisen International School, The American School in Japan |
| **🇮🇳 IN** | Kendriya Vidyalaya (Local Branch), DPS Junior School, Government Primary School, City Corporation School No. 5 | The Cathedral & John Connon Primary, The Doon School (Junior), Bombay Scottish School, Scindia Kanya Vidyalaya |
| **🇩🇪 DE** | Grundschule an der Limesstraße, Mozart-Grundschule, Albert Einstein GS, Geschwister-Scholl-Schule | Bavarian International School, Berlin British School (Primary), Phorms School, St. George's The English School |
| **🇫🇷 FR** | École Élémentaire Publique Jules Ferry, École Maternelle et Élémentaire Victor Hugo, École de la République | École Jeannine Manuel, L'École Montessori, École Active Bilingue (EABJM), Notre-Dame de Sion Primary |

## **Next Logic Implementation**

1. **Update useGameStore Initialization:** When a new game starts (Age 0), set the educationStatus to 0 (Uneducated).  
2. **Update advanceYear Logic:** In the advanceYear function, add a condition:  
   * if (age \=== 5 || age \=== 6\) and (educationStatus \=== 0): Automatically enroll the Sim in their country's Primary School system.  
3. **Implement Status Change:** Create a special internal event when the Sim reaches the Primary School End Age (e.g., 11 or 12, depending on country) that automatically sets educationStatus to 1\.