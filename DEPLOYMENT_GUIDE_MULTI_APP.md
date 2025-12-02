# Multi-App Deployment Guide for AWS EC2 using Nginx

This guide explains how to deploy the AdmissionAI application on an AWS EC2 instance that is already running another website. We will use **Nginx** as a reverse proxy to manage traffic between the two applications.

## Core Concept

Instead of having your Node.js app listen directly on the public port 80, Nginx will listen on port 80. When a request comes in, Nginx will check the requested domain name (e.g., `admission.ai` or `my-other-site.com`) and forward the request to the correct application running on an internal port (e.g., port 5000 for your existing app, port 5001 for the new AdmissionAI app).



## Prerequisites

1.  **Existing EC2 Instance**: You have an EC2 instance running another web application.
2.  **SSH Access**: You have SSH access to your instance using your `.pem` key.
3.  **Two Domain Names**: You need a separate domain or subdomain for each application (e.g., `my-other-site.com` and `admission.ai`).
4.  **DNS Configured**: Both domain names should have their DNS 'A' records pointing to your EC2 instance's public IP address.

---

## Step 1: Deploy the AdmissionAI Application

First, we'll get your new application running on the server on a new, unused port.

1.  **Connect to EC2**:
    ```bash
    ssh -i "your-key-name.pem" ec2-user@your-public-dns.amazonaws.com
    ```

2.  **Clone Your Repository**:
    ```bash
    # Navigate to your home directory or another suitable location
    cd ~
    git clone https://your-git-repository-url.com/admissionai.git
    ```

3.  **Set Up Backend**:
    - Navigate to the backend directory: `cd admissionai/backend`
    - Install dependencies: `npm install`
    - Create the `.env` file with your production secrets:
        ```bash
        nano .env
        ```
    - **Crucially, set a new port that is not being used by your other application.**
        ```
        # .env file for AdmissionAI
        PORT=5001 # Use a new port, e.g., 5001
        MONGO_URI="mongodb+srv://..."
        GOOGLE_CLIENT_ID="..."
        # ... all other keys
        ```
    - Save the file (`Ctrl+X`, `Y`, `Enter`).

4.  **Build the Frontend**:
    - Navigate to the frontend directory: `cd ../frontend`
    - Install dependencies: `npm install`
    - Build the static files: `npm run build`

5.  **Start the App with PM2**:
    - Navigate back to the backend directory: `cd ../backend`
    - Start your new app on port **5001** using `pm2`. Give it a unique name.
    ```bash
    pm2 start server.js --name "admissionai-app"
    ```
    - Verify it's running: `pm2 list`. You should now see both your old and new applications running.

---

## Step 2: Install and Configure Nginx

Now, we'll set up Nginx to act as the reverse proxy.

1.  **Install Nginx**:
    ```bash
    sudo yum install nginx -y
    ```

2.  **Start and Enable Nginx**:
    ```bash
    sudo systemctl start nginx
    sudo systemctl enable nginx
    ```
    At this point, if you visit your EC2's public IP, you should see the default Nginx welcome page. This confirms Nginx is listening on port 80.

---

## Step 3: Create Nginx Server Blocks

We will use the `sites-available` and `sites-enabled` structure, which provides a clean way to manage multiple sites.

1.  **Create a Config File for AdmissionAI**:
    - Use `nano` to create a new configuration file in `sites-available`.
    ```bash
    sudo nano /etc/nginx/sites-available/admissionai
    ```
    - Paste the following configuration. **Replace `your-admission-ai-domain.com` with your actual domain name.**

    ```nginx
    server {
        listen 80;
        server_name your-admission-ai-domain.com;

        location / {
            proxy_pass http://localhost:5001; # Forward to the AdmissionAI app
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
        }
    }
    ```
    - Save the file (`Ctrl+X`, `Y`, `Enter`).

2.  **Enable the New Site**:
    - Create a symbolic link from your config file in `sites-available` to the `sites-enabled` directory. This tells Nginx to use this configuration.
    ```bash
    sudo ln -s /etc/nginx/sites-available/admissionai /etc/nginx/sites-enabled/
    ```

3.  **Update Config for Your Existing App**:
    - Your existing app should already have a similar file in `/etc/nginx/sites-available/`. If it's in `conf.d`, it's best to move it for consistency.
    - Let's assume you need to create or move it. **Replace `your-existing-domain.com` and the port number.**
    ```bash
    sudo nano /etc/nginx/sites-available/existing-app
    ```
    - Add a similar configuration:

    ```nginx
    server {
        listen 80;
        server_name your-existing-domain.com;

        location / {
            proxy_pass http://localhost:5000; # Forward to your existing app
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
        }
    }
    ```
    - If you created a new file for your existing app, remember to enable it as well:
    ```bash
    sudo ln -s /etc/nginx/sites-available/existing-app /etc/nginx/sites-enabled/
    ```

4.  **Test and Restart Nginx**:
    - It's vital to test your Nginx configuration for syntax errors before restarting.
    ```bash
    sudo nginx -t
    ```
    - If it shows `syntax is ok` and `test is successful`, you are good to go. If not, it will tell you which file and line has the error.
    - Restart Nginx to apply the new configurations:
    ```bash
    sudo systemctl restart nginx
    ```

---

### Deployment Complete

You should now be able to access:
- `http://your-admission-ai-domain.com` -> This will show your **AdmissionAI** application.
- `http://your-existing-domain.com` -> This will show your **other** application.

Nginx is successfully routing traffic to the correct application based on the domain name requested by the user.