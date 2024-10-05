# Use an official nginx image as the base image
FROM nginx:alpine

# Copy the build folder to the appropriate location in the nginx container
COPY ./dist /usr/share/nginx/html

# Expose the port that nginx will serve on
EXPOSE 80

# Start nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]