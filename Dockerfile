# 1️⃣ Use official Node image
FROM node:22-alpine

# 2️⃣ Create app directory
WORKDIR /app

# 3️⃣ Copy package files first (for better caching)
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy remaining project files
COPY . .

# 6️⃣ Expose app port
EXPOSE 5000

# 7️⃣ Start the app
CMD ["npm", "start"]