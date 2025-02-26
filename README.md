## BLOP

BLOP is a social network I created as a portfolio project, designed to closely mirror the functionality of modern social media platforms. My goal was to make it as realistic and feature-rich as possible, providing users with an experience they would expect from today’s social networks.
## Project Structure

The project is structured as follows:
- `/client`: NextJS application.
- `/server`: Express server with Socket.IO for real-time notifications.

## Project Features

### Posts & Interactions

- **Publish posts** with text, images, or videos.
- **Comment on posts** to engage in discussions.
- **Reply to comments**, allowing direct responses.
- **Nested replies** (similar to Reddit) for deeper conversations.
- **Quote a single or multiple posts** to reference specific content in responses.

### Account & Profile Management

- **Edit and customize profile**, including:
  - Username
  - Profile name
  - Profile picture & banner
  - Bio
- **Change email** associated with the account.
- **Reset password** for account security.
- **Link multiple accounts** for seamless switching between them.
- **Delete user account** with secure confirmation and complete data purging.

### Content Management

- **Save drafts** of posts, comments, and replies for later editing.
- **Edit posts, comments, and replies**, with a revision history to track changes.
- **Delete posts, comments, and replies** to remove unwanted content.

### Notification System

- **Real-time notifications** implemented using Socket.IO.
- Currently sends notifications when users publish new posts to users who have subscribed to receiving notifications from that specific user.
- Live updates delivered instantly to the user interface.
- Subscription-based notification model allowing users to control which updates they receive.

## Future Development

- **Search functionality:** Implement robust search capabilities allowing users to find posts by keywords, hashtags, and usernames.

- **Filter functionality for timeline:** Enhance the user experience with multiple filtering options:

  - **Recent**: Chronological display of posts with newest content first.
  - **Recommended**: Personalized feed based on user interests and interaction history.
  - **Trending**: Show popular content gaining significant engagement across the platform within customizable timeframes (hourly, daily, weekly).

- **Allow Quoting Comments:** Currently, only posts can be quoted. Expanding this functionality to comments and replies would enhance engagement by allowing users to reference and build upon specific discussions.

- **Expanded notification types:** Enhance the notification system to include additional notification types:

  - Likes on posts and comments
  - New comments and replies
  - Mentions in posts and comments

- **Direct media uploads:** Currently, the platform only supports rendering media through pasted links. Future development should include direct upload capabilities for images and videos.

- **Moderation tools:** Implement user-focused moderation capabilities:

  - Mute users to hide their content.
  - Block users to prevent interaction.
  - Filter content by blocking specific words, hiding any content containing them.

## Lessons Learned

- **Authentication Approach**: This project uses Next Auth, but I will be using Better Auth for future projects. Next Auth intentionally complicates email/username and password authentication by making poor documentation to encourage OAuth adoption.

## Getting Started

**Prerequisites**

- Node.js (v18 or later)
- npm or yarn
- Git

**Step 1: Clone the Repository**

Option 1: Clone via Git
Run the following command in your terminal:

```bash
git clone https://github.com/frederikhandberg0709/blop-social-media.git
```

Option 2: Download ZIP

1. Click the green `Code` dropdown button
2. Select `Download ZIP`
3. Extract the downloaded ZIP file to your desired location

![Screenshot](.github/github-repo-download.png)

**Step 2: Install Dependencies**

Install dependencies for both client and server:

```bash
# Install client dependencies
cd client
npm install

# Install client dependencies
cd server
npm install
```

**Step 3: Set up Environment Variables**

Create a file named `.env` in the root directory.
Copy the contents from `.env.template` located in the `.github` folder and paste them into the new `.env` file.

Make sure to enter a value for `NEXTAUTH_SECRET`, as otherwise, the user authentication will not work.

```.env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME"
```

Replace the placeholders with your local database credentials:
• `USERNAME`: Your database username
• `PASSWORD`: Your database password
• `DATABASE_NAME`: Name of your database

Note: If you're using cloud providers like AWS, you'll need to use the credentials provided by your cloud service instead of your local database credentials.

**Step 4: Initialize Database**

Run the following command in a terminal from the client directory:

```bash
cd client
npx prisma migrate dev --name init
```

This command creates and applies a database migration based on the Prisma schema (`schema.prisma`). A migration is necessary to sync your database structure with the Prisma schema. It creates the required tables, columns, and relationships in your database.

**Step 5: Run Development Server**

Start both the client and server:

```bash
# Terminal 1 - Start the server
cd server
npm run dev

# Terminal 2 - Start the client
cd client
npm run dev
```

The client will be available at http://localhost:3000 and the server at http://localhost:4000.
