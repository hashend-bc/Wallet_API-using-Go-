# Use official Go image
FROM golang:1.22-alpine

# Set working directory
WORKDIR /app

# Copy go.mod & download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy all files
COPY . .

# Build the app
RUN go build -o main .

# Expose port
EXPOSE 8080

# Run the app
CMD ["./main"]