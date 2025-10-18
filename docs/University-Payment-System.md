# University Payment System - Implementation Guide

## Overview
The university payment system now features three fully functional payment methods with logical flows and financial consequences. Students can choose how to finance their education, with each method having unique advantages and trade-offs.

## Payment Methods

### 1. 💰 Student Loan
**Description**: Borrow money to pay for tuition and repay after graduation.

#### Enrollment Process:
1. Student selects "Apply for student loan"
2. No upfront payment required - enrollment happens immediately
3. Total tuition cost (annual cost × duration) is added to `studentLoanDebt`
4. Loan is tracked in `studentLoanHistory` with course name and date

#### Repayment Logic:
**Automatic Repayment on Graduation:**
- When course completes, system triggers automatic loan repayment
- Default: Pay **half** of the total course cost
- If student has sufficient funds:
  - Money is deducted
  - Loan debt is reduced
  - Toast notification shows payment and remaining debt
- If student cannot afford repayment:
  - Debt remains in full
  - Warning notification displayed
  - Student can work to earn money and repay later

**Manual Repayment:**
- Students can call `repayStudentLoan(amount)` at any time
- Can pay full debt or partial amount
- System prevents over-payment
- Success toast when fully paid off

#### Example Flow:
```
1. Enroll in Ivy League ($80k/year × 4 years = $320k total)
2. Choose "Student Loan"
3. → studentLoanDebt += $320,000
4. Study for 4 years
5. Graduate
6. System attempts to deduct $160,000 (half)
7. If money >= $160k: Pay $160k, debt = $160k remaining
8. Work and manually repay remaining $160k over time
```

---

### 2. 👨‍👩‍👧 Ask Parents to Pay
**Description**: Request financial support from parents.

#### Enrollment Process:
1. Student selects "Ask my parents to pay"
2. System simulates parent decision:
   - **80% chance parents agree** (currently random)
   - Future enhancement: Based on parent relationship
3. If parents agree:
   - No cost to student
   - No debt incurred
   - Enrollment successful
   - Toast: "Parents agreed to pay!"
4. If parents decline:
   - Enrollment fails
   - Student must choose different payment or university

#### Advantages:
- ✅ No cost to student
- ✅ No debt
- ✅ Best financial option if parents agree

#### Disadvantages:
- ❌ Not guaranteed (20% rejection rate)
- ❌ No fallback if declined mid-enrollment

#### Future Enhancements:
- Tie acceptance to parent relationship score
- Allow negotiation or persistence
- Impact relationship based on cost

---

### 3. 💵 Pay with Cash
**Description**: Use personal savings to pay tuition upfront.

#### Enrollment Process:
1. Student selects "Pay with cash"
2. System calculates total cost (annual × duration)
3. Verifies student has sufficient funds:
   - If money >= total cost: Proceed
   - If money < total cost: Enrollment fails
4. Full amount deducted immediately
5. No debt incurred
6. Enrollment confirmed

#### Advantages:
- ✅ No debt
- ✅ No repayment obligations
- ✅ Clean financial slate
- ✅ Guaranteed if you have the money

#### Disadvantages:
- ❌ Requires substantial savings
- ❌ Depletes cash reserves
- ❌ May leave student with no emergency funds

#### Example:
```
Student has $350,000 in savings
Ivy League: $80k/year × 4 years = $320k total

Select "Pay with cash"
→ Money: $350,000 - $320,000 = $30,000
✅ Enrolled with $30k remaining for living expenses
```

---

## Technical Implementation

### New State Variables

```typescript
type GameState = {
  // ... existing fields
  studentLoanDebt: number;
  studentLoanHistory: Array<{ 
    amount: number; 
    course: string; 
    date: string 
  }>;
};
```

### Updated Enrollment Type

```typescript
export interface Enrollment {
  id: string;
  name: string;
  duration: number;
  timeRemaining: number;
  cost?: number;
  grantsStatus?: number;
  preReqs?: PreReqs;
  major?: string;
  paymentMethod?: 'loan' | 'parents' | 'cash';
}
```

### enrollCourse Function Logic

```typescript
enrollCourse: (course: Course & { 
  major?: string; 
  paymentMethod?: 'loan' | 'parents' | 'cash' 
}) => {
  // Calculate total cost
  const totalCost = (course.cost || 0) * (course.duration || 1);
  const paymentMethod = course.paymentMethod || 'cash';

  // Payment method handling
  if (paymentMethod === 'cash') {
    // Verify funds
    if (money < totalCost) return FAIL;
    // Deduct full amount
    money -= totalCost;
  } 
  else if (paymentMethod === 'loan') {
    // No upfront payment
    // Add to loan debt
    studentLoanDebt += totalCost;
    studentLoanHistory.push({...});
  }
  else if (paymentMethod === 'parents') {
    // Simulate parent decision
    const willPay = Math.random() > 0.2; // 80% success
    if (!willPay) return FAIL;
    // No cost to student
  }

  // Complete enrollment
  set({ currentEnrollment: {...} });
}
```

### handleCourseCompletion Logic

```typescript
handleCourseCompletion: (completedCourse: Enrollment) => {
  // Check for loan repayment
  if (completedCourse.paymentMethod === 'loan') {
    const totalCost = cost * duration;
    const repayment = totalCost / 2; // Half payment
    
    if (money >= repayment) {
      money -= repayment;
      studentLoanDebt -= repayment;
      Toast.show('Paid $X. Remaining debt: $Y');
    } else {
      Toast.show('Cannot afford repayment!');
    }
  }
  
  // Apply skill boosts, update status, etc.
  // Clear enrollment
}
```

### Manual Repayment Function

```typescript
repayStudentLoan: (amount?: number) => {
  if (studentLoanDebt <= 0) return;
  
  const repay = amount || Math.min(money, studentLoanDebt);
  
  if (money < repay) return FAIL;
  
  money -= repay;
  studentLoanDebt -= repay;
  
  if (studentLoanDebt === 0) {
    Toast.show('Debt Free!');
  }
}
```

---

## User Experience Flow

### Example 1: Student Loan Path
```
Age 18, Money: $50,000, Smarts: 90

1. Browse universities → Select Ivy League ($80k/year, 4 years)
2. Choose major: Computer Science
3. Choose payment: "Apply for student loan"
   → Loan approved: $320,000
   → Current debt: $320,000
   → Bank balance: $50,000 (unchanged)

4. Attend university for 4 years

5. Graduate at age 22
   → System attempts to collect $160,000 (half)
   → Bank balance: $50,000 (insufficient)
   → Toast: "Cannot afford repayment. Debt: $320,000"

6. Get job, earn money over 2 years → $180,000 saved

7. Manually repay:
   → Call repayStudentLoan($160,000)
   → Bank: $180,000 - $160,000 = $20,000
   → Debt: $320,000 - $160,000 = $160,000

8. Continue earning, final payment:
   → Save another $160,000
   → Call repayStudentLoan($160,000)
   → Debt: $0
   → Toast: "Debt Free! 🎉"
```

### Example 2: Parents Pay Path
```
Age 18, Money: $10,000, Good relationship with parents

1. Select Private University ($60k/year, 4 years = $240k total)
2. Choose major: Business
3. Choose payment: "Ask my parents to pay"
   → Random check: SUCCESS (80% chance)
   → Toast: "Parents agreed to pay!"
   → Bank balance: $10,000 (unchanged)
   → No debt incurred

4. Attend university for 4 years

5. Graduate at age 22
   → No loan repayment required
   → Bank balance: Still has $10,000
   → Can start career debt-free
```

### Example 3: Cash Payment Path
```
Age 18, Money: $500,000 (inheritance), Smarts: 85

1. Select Ivy League ($80k/year, 4 years = $320k total)
2. Choose major: Medicine
3. Choose payment: "Pay with cash"
   → Verify funds: $500k >= $320k ✓
   → Bank: $500,000 - $320,000 = $180,000
   → Toast: "Paid $320,000 for Ivy League"
   → No debt

4. Attend university for 4 years

5. Graduate at age 22
   → No loan repayment
   → Bank balance: $180,000 remaining
   → Debt-free with savings intact
```

---

## Financial Impact Comparison

| Payment Method | Upfront Cost | Debt Created | Graduation Impact | Best For |
|----------------|--------------|--------------|-------------------|----------|
| **Student Loan** | $0 | Full tuition | Pay 50% if possible | Low savings, need education |
| **Parents Pay** | $0 | $0 | None | Good parent relationship |
| **Pay Cash** | Full tuition | $0 | None | High savings, want debt-free life |

---

## Future Enhancements

### Priority 1: Enhanced Loan Options
- [ ] Choose repayment plan: 50%, 75%, 100%
- [ ] Interest accumulation on unpaid loans
- [ ] Monthly payment plans instead of lump sum
- [ ] Loan forgiveness programs for certain careers
- [ ] Default consequences if unable to pay

### Priority 2: Parent System Integration
- [ ] Parent relationship score affects approval
- [ ] Parent wealth level determines ability to pay
- [ ] Partial payment options from parents
- [ ] Relationship impact based on tuition cost
- [ ] Sibling fairness considerations

### Priority 3: Scholarship System
- [ ] Merit-based scholarships for high smarts
- [ ] Athletic scholarships
- [ ] Need-based financial aid
- [ ] Reduce tuition cost before payment selection

### Priority 4: Employment Integration
- [ ] Work-study programs to reduce loan amount
- [ ] Part-time jobs to pay tuition in installments
- [ ] Co-op programs that offset costs
- [ ] Employer tuition reimbursement

### Priority 5: UI Enhancements
- [ ] Display current student debt in header
- [ ] Loan calculator showing repayment scenarios
- [ ] Parent success probability indicator
- [ ] Cash payment affordability warning
- [ ] Debt-to-income ratio warnings

---

## Testing Scenarios

### Test Case 1: Loan Full Repayment
```
Setup: Money = $400k, Choose $320k university with loan
Expected: 
- Enrollment: Debt = $320k, Money = $400k
- Graduation: Debt = $160k, Money = $240k (paid half)
```

### Test Case 2: Loan Cannot Afford
```
Setup: Money = $50k, Choose $320k university with loan
Expected:
- Enrollment: Debt = $320k, Money = $50k
- Graduation: Debt = $320k, Money = $50k (no payment)
- Toast: "Insufficient funds"
```

### Test Case 3: Parents Decline
```
Setup: Choose university, select "Parents pay", random fails (20%)
Expected:
- Enrollment fails
- Toast: "Parents declined"
- Money unchanged
- No enrollment
```

### Test Case 4: Cash Insufficient
```
Setup: Money = $100k, Choose $320k university with cash
Expected:
- Enrollment fails
- Toast: "Insufficient funds"
- Money = $100k (unchanged)
```

### Test Case 5: Manual Loan Repayment
```
Setup: Debt = $100k, Money = $150k
Action: repayStudentLoan($50k)
Expected:
- Money = $100k
- Debt = $50k
- Toast: "Payment made"
```

---

## Event Log Examples

```
// Loan enrollment
"10/18/2025: Enrolled in Ivy League University. Took student loan of 320,000."

// Cash enrollment
"10/18/2025: Enrolled in State University. Paid 100,000 cash."

// Parents enrollment
"10/18/2025: Enrolled in Private University. Parents paid tuition."

// Loan repayment success
"10/18/2029: Repaid $160,000 student loan for Ivy League University."

// Loan repayment failure
"10/18/2029: Unable to repay student loan for Ivy League University. Debt remains: $320,000"

// Manual repayment
"10/18/2030: Repaid $50,000 student loan. Remaining: $110,000."

// Debt free
"10/18/2031: Repaid $110,000 student loan. Remaining: $0."
```

---

## Summary

✅ **Student Loan**: Works! Takes loan → Study → Auto-repay half on graduation → Manual repay remainder
✅ **Parents Pay**: Works! 80% success rate → Free education if accepted
✅ **Pay Cash**: Works! Deducts full tuition upfront → No debt

All payment methods are now fully functional with logical financial flows and consequences!
