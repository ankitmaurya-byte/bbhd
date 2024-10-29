# Use a lightweight web server image
FROM nginx:alpine

# Copy the built React files from the "dist" folder to the Nginx web server folder
COPY dist /usr/share/nginx/html

# Expose port 80 for the container
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
