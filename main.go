// @title Wallet API
// @version 1.0
// @description Simple Wallet API using Echo
// @host localhost:8080
// @BasePath /

package main

import (
	"fmt"
	"log"
	"os"

	"github.com/labstack/echo/v4"
	echomiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/joho/godotenv"

	"wallet-api/handlers"
	"wallet-api/middleware"
	"wallet-api/store"

	_ "wallet-api/docs"
	echoSwagger "github.com/swaggo/echo-swagger"
)

func main() {

	// 🔹 Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// 🔹 Get PORT
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// 🔹 Initialize DB (Pebble or in-memory fallback)
	store.InitDB() // 👈 IMPORTANT (your Pebble setup)

	// 🔹 Create Echo instance
	e := echo.New()

	// 🔹 Built-in middleware
	e.Use(echomiddleware.Recover())

	e.Use(echomiddleware.CORSWithConfig(echomiddleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Content-Type"},
	}))

	// 🔹 Custom middleware
	e.Use(middleware.Logger)
	e.Use(middleware.RateLimiter)

	// 🔹 Routes
	e.POST("/wallets", handlers.CreateWallet)
	e.GET("/wallets/:id", handlers.GetWallet)
	e.POST("/wallets/:id/transactions", handlers.AddTransaction)
	e.GET("/wallets/:id/transactions", handlers.GetTransactions)

	// 🔹 Swagger
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	// 🔹 Start server
	fmt.Println("🚀 Server running on port", port)
	if err := e.Start(":" + port); err != nil {
		log.Fatal(err)
	}
}