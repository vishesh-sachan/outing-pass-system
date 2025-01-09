# Outing Pass System

[Live Link](https://outing-pass-system.vercel.app/)  
[Repository Link](https://github.com/vishesh-sachan/outing-pass-system.git)

## Overview

This project was developed to address the inconvenience hostel students face while creating an out-pass to leave the college campus. It optimizes the process, transforming it from a tedious manual system to a streamlined digital solution. Students can now apply for passes from their rooms, and wardens can approve them with a single click.

---

## Process

### Before
1. **Go to** the hostel reception.
2. Fill out **same entries** in two registers.
3. Fill out a pass slip.
4. **Get your pass signed.**
5. Go to the guard and fill out **same entry** in another register.
6. Get back the signed pass from the guard.
7. You can now leave the college.
8. Upon returning, **fill the entry time** in the guard's register and return the pass slip.
9. Then **fill out entry time** in hostel registers and sign.

### After
1. **Fill out entries only once from anywhere.** (No need to go to hostel reception.)
2. After the pass is approved, **get an E-pass with a QR code.**
3. **While entering and exiting** the college campus, **just scan your QR code.**

This project eliminates redundant steps, saving time and effort for both students and staff.

---

## Work Flow

![workFlow.png](/images/workFlow.png)

---

## Technical Approach

- **Frontend and Backend:** Built using **Next.js**.
- **Real-time Communication:** Utilizes a **WebSocket server** for real-time data exchange (e.g., notifying students when passes are approved or rejected).
- **Database:** SQL database with related tables for efficient data management.

### Pages

#### SignIn Page
- Allows users to **sign in** using their official college email via Google.
- **Passwordless login** for convenience.

![signIn.png](/images/signIn.png)

#### Home Page
- Displays relevant information to the logged-in user.

![s1.png](/images/s1.png)  
![w1.png](/images/w1.png)  
![g1.png](/images/g1.png)

#### Dashboard Page
- Shows the logged-in user's **personal information** and their **previous passes** (for students).

![s2.png](/images/s2.png)  
![w2.png](/images/w2.png)

#### Apply Pass Page
- Allows students to **apply for a pass** and track its status.
- Displays an **E-pass** for approved requests.

![s4.png](/images/s4.png)  
![s6.png](/images/s6.png)  
![s8.png](/images/s8.png)

#### Pass Request Page
- Enables wardens and admins to **approve or reject students' pass requests.**

![w3.png](/images/w3.png)
![w4.png](/images/w4.png)  

#### Guard's Page
- Allows guards to **scan students' E-pass QR codes.**
- Displays **appropriate messages** for cases like fake passes or reused passes.

![g2.png](/images/g2.png)  
![g3.png](/images/g3.png)  
![g5.png](/images/g5.png)  
![g7.png](/images/g7.png)

#### Error Pages
- Display **appropriate error messages** based on user status and access.

![e1.png](/images/e1.png)  
![e2.png](/images/e2.png)

## Local Setup

To set up the project locally, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/vishesh-sachan/outing-pass-system.git
    ```
2. **Navigate to the project directory:**
    ```bash
    cd outing-pass-system
    ```
3. **Install dependencies:**
    ```bash
    npm install
    ```
4. **Set up environment variables:**
    - Create a `.env.local` file in the root directory.
    - Add the necessary environment variables as specified in the `.env.example` file.

5. **Migrate the database:**
    ```bash
    npx prisma migrate dev
    ```

6. **Run the development server:**
    ```bash
    npm run dev
    ```
7. **Open your browser and visit:**
    ```
    http://localhost:3000
    ```

You should now be able to see the application running locally.