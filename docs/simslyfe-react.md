SimsLyfe React Native Logic Implementation (Conceptual)
This document provides conceptual JavaScript/React Native code for implementing the Enrollment Logic, Course List Component, and the Game Loop/Completion logic, assuming state management via React Context (useSimContext).

I. The Enrollment Logic Function (handleEnrollment)
This function executes the complex checks defined in the education_catalog.md before allowing a Sim to enroll in a course.

// Function that runs when "Enroll" is pressed on a course (in CourseListScreen.js)
const handleEnrollment = (course, simState, dispatch, navigation) => {
    
    // --- Constraint 1: Currently Enrolled Check (Mutual Exclusion) ---
    if (simState.isCurrentlyEnrolled) {
        // Use a modal/custom alert component in RN
        alert('Error: You must complete or drop your current education before enrolling in a new one.'); 
        return;
    }

    // --- Constraint 2: Age Check (Based on Tiers) ---
    if (course.requiredAge && simState.age < course.requiredAge) {
        alert(`Error: You must be at least ${course.requiredAge} to enroll here.`);
        return;
    }

    // --- Constraint 3: Educational Status Check (Tiers) ---
    // Note: 'requiredStatus' comes from the catalog data (e.g., 2, 4, or 5)
    if (simState.educationStatus < course.requiredStatus) {
        // Assume getStatusName(status) is a helper that converts '4' to 'CC A.A./A.S. Graduate'
        const requiredName = getStatusName(course.requiredStatus); 
        alert(`Error: You need to be a ${requiredName} to enroll.`);
        return;
    }

    // --- Constraint 4: Financial Check ---
    if (simState.money < course.cost) {
        alert('Error: You cannot afford the tuition. Try a Student Loan option!');
        return;
    }
    
    // --- Constraint 5: Skill/Stat Check ---
    // Example for B.S. Pre-Medical Studies requiring High Science Skill:
    if (course.preReqs.requiredSkill && simState.skills[course.preReqs.requiredSkill] < course.preReqs.value) {
        alert(`Error: Your ${course.preReqs.requiredSkill} skill is too low. Try studying or an online course first.`);
        return;
    }

    // --- PASSED ALL CHECKS: PROCESS ENROLLMENT ---
    // Deduct initial tuition cost
    dispatch({ type: 'DEDUCT_MONEY', payload: course.cost }); 
    
    // Set enrollment state
    dispatch({ 
        type: 'ENROLL_COURSE', 
        payload: { 
            ...course,
            timeRemaining: course.duration // Start the game time counter
        } 
    });
    
    alert(`Successfully enrolled in ${course.name}! Time to study...`);
    navigation.goBack(); 
};

II. The Course List Component (CourseListScreen.js)
This component renders the list of courses for a selected education level and handles button visibility based on Sim eligibility.

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { EDUCATION_DATA } from './EducationData'; // Assumed data structure
import { useSimContext } from './SimContext'; // Assumed Context hook
import { handleEnrollment } from './LogicFunctions'; // Imported enrollment function

export default function CourseListScreen({ route, navigation }) {
    const { educationLevel } = route.params; // e.g., 'University'
    const courses = EDUCATION_DATA[educationLevel] || [];
    const { simState, dispatch } = useSimContext();

    const renderItem = ({ item: course }) => {
        
        // Check 1: Sim is currently enrolled elsewhere
        const isBlocked = simState.isCurrentlyEnrolled; 
        
        // Check 2: Sim doesn't meet the educational status prerequisite
        const isNotEligible = simState.educationStatus < course.requiredStatus || simState.age < (course.requiredAge || 0);

        return (
            <View style={styles.courseCard}>
                <Text style={styles.courseName}>{course.name}</Text>
                <Text style={styles.courseDetails}>Duration: {course.duration} Years | Cost: ${course.cost}</Text>
                
                {isBlocked || isNotEligible ? (
                    <Text style={styles.notEligibleText}>
                        {isBlocked ? 'Busy elsewhere.' : 'Prerequisites not met.'}
                    </Text>
                ) : (
                    <TouchableOpacity 
                        style={styles.enrollButton}
                        onPress={() => handleEnrollment(course, simState, dispatch, navigation)}
                    >
                        <Text style={styles.enrollButtonText}>Enroll</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <FlatList
            data={courses}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
        />
    );
}

// ... styles defined here

III. Implement Game Loop and Completion Logic
This logic is typically run in the background (e.g., in SimContext.js or the main game loop controller).

// Function run on a game tick (e.g., when the Sim selects 'Advance Time' or 'Sleep')
const processGameTick = (simState, dispatch) => {
    
    // Advance Sim's Age/Time by the duration of one tick (e.g., 3 months)
    dispatch({ type: 'ADVANCE_AGE' }); 

    if (simState.isCurrentlyEnrolled) {
        
        // Reduce time remaining
        const newTimeRemaining = simState.currentEnrollment.timeRemaining - 0.25; // Assuming 4 ticks = 1 year
        
        // Update state with remaining time
        dispatch({ type: 'UPDATE_ENROLLMENT_TIME', payload: newTimeRemaining });

        // --- Check for Completion ---
        if (newTimeRemaining <= 0) {
            handleCourseCompletion(simState.currentEnrollment, dispatch);
        }
    }
};

// Function executed upon course completion
const handleCourseCompletion = (completedCourse, dispatch) => {
    
    // 1. Update permanent records
    dispatch({ type: 'ADD_DEGREE', payload: completedCourse.name });
    
    // 2. Apply Logical Constraint (Update Status based on catalog)
    const constraint = completedCourse.logicalConstraint;

    if (constraint && constraint.grantsStatus) {
        // Grants Status 4 (A.A.) or Status 5 (B.S.) or Status 6 (M.D./J.D./MBA)
        dispatch({ type: 'UPDATE_STATUS', payload: constraint.grantsStatus });
    }
    
    // 3. Reset enrollment status
    dispatch({ type: 'UNENROLL' });
    
    alert(`Congratulations! You graduated from ${completedCourse.name}.`);
    
    // *Optional: Trigger post-completion events (e.g., MCAT/LSAT exam prompt)
};
