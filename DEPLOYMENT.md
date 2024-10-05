# 🚀 Deployment Guide for Schnitzelroids

This guide provides instructions on how to deploy and run the Schnitzelroids game server.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your server:

- Node.js (version 12.x or higher recommended)
- npm (usually comes with Node.js)
- Git (for cloning the repository)

## 🛠️ Deployment Steps

1. **Clone the Repository**

   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

   Replace `<repository_url>` with the actual URL of your Git repository, and `<repository_directory>` with the name of the directory created by the clone operation.

2. **Install Dependencies**

   ```bash
   npm install
   ```

   This will install all the necessary dependencies as defined in the `package.json` file.

3. **Configure the Application**

   If there are any configuration files or environment variables that need to be set, do so now. This may include:
   
   - Setting up environment variables
   - Modifying any configuration files if necessary

4. **Start the Server**

   ```bash
   node server.js
   ```

   This command starts the server. By default, it will likely run on `http://localhost:3000` or another port specified in the `server.js` file.

5. **(Optional) Use a Process Manager**

   For production environments, it's recommended to use a process manager like PM2. Here are some useful PM2 commands:

   ```bash
   # Install PM2 globally
   npm install -g pm2

   # Start the application
   pm2 start server.js --name schnitzelroids

   # Stop the application
   pm2 stop schnitzelroids

   # Restart the application
   pm2 restart schnitzelroids

   # View application logs
   pm2 logs schnitzelroids

   # Monitor the application
   pm2 monit

   # List all running applications
   pm2 list

   # Set up PM2 to start on system boot
   pm2 startup
   pm2 save
   ```

   Using PM2 ensures that your application stays running even after server restarts or crashes. The `--name` flag allows you to give your application a specific name for easier management.

6. **Set Up a Reverse Proxy (Optional but Recommended)**

   For production deployments, it's recommended to set up a reverse proxy server like Nginx. This can handle SSL termination, load balancing, and serve static files more efficiently.

## 🎮 Running the Application

Once deployed, the application should be accessible via a web browser. If you're running it locally or on a server without a domain name, you can access it via the server's IP address or localhost:

```
http://<server_ip>:<port>
```

Replace `<server_ip>` with your server's IP address or domain name, and `<port>` with the port number your application is running on (likely 3000 if not changed in the code).

## 🔍 Troubleshooting

- If you encounter any issues starting the server, check the console output for error messages.
- Ensure all required ports are open on your server's firewall.
- Check the server logs for any runtime errors. If using PM2, you can view logs with `pm2 logs schnitzelroids`.

## 🔄 Updating the Application

To update the application to a new version:

1. Stop the current running instance (`pm2 stop schnitzelroids` if using PM2)
2. Pull the latest changes from the git repository
3. Install any new dependencies with `npm install`
4. Start the server again (`pm2 start schnitzelroids` if using PM2)

Remember to backup any important data before performing updates.
