## BLOP

BLOP is a social network I created as a portfolio project, designed to closely mirror the functionality of modern social media platforms. My goal was to make it as realistic and feature-rich as possible, providing users with an experience they would expect from today’s social networks.

## Project Features

### Posts and Interactions

- **Publish posts** with text, images, or videos.
- **Comment on posts** to engage in discussions.
- **Reply to comments**, allowing direct responses.
- **Nested replies** (similar to Reddit) for deeper conversations.

### Account & Profile Management

- **Edit and customize profile**, including:
  - Username
  - Profile name
  - Profile picture & banner
  - Bio
- **Change email** associated with the account.
- **Reset password** for account security.
- **Link multiple accounts** for seamless switching between them.

### Content Management

- **Save drafts** of posts, comments, and replies for later editing.
- **Edit posts, comments, and replies**, with a revision history to track changes.
- **Delete posts, comments, and replies** to remove unwanted content.

### Moderation Tools

- **Mute users** to hide their content.
- **Block users** to prevent interaction.
- **Filter content** by blocking specific words, hiding any content containing them.

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

```bash
npm install
# or
yarn install
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

Run the following command in a terminal:

```zsh
npx prisma migrate dev --name init
```

This command creates and applies a database migration based on the Prisma schema (`schema.prisma`). A migration is necessary to sync your database structure with the Prisma schema. It creates the required tables, columns, and relationships in your database.

**Step 5: Run Development Server**

Run the following command in a terminal:

```zsh
npm run dev
```
