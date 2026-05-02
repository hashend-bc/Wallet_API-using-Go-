// @title Wallet API
// @version 1.0
// @description Simple Wallet API using Echo
// @host localhost:8080
// @BasePath /



package main

import (
	"fmt"
	"os"

	"github.com/labstack/echo/v4"
	echomiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/joho/godotenv"

	"wallet-api/handlers"
	"wallet-api/middleware"

	_ "wallet-api/docs"
	echoSwagger "github.com/swaggo/echo-swagger"
)

func main() {

	// load env
	godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	e := echo.New()

	// middleware
	e.Use(echomiddleware.CORSWithConfig(echomiddleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Content-Type"},
	}))
	e.Use(middleware.Logger)
	e.Use(middleware.RateLimiter)

	// routes
	e.POST("/wallets", handlers.CreateWallet)
	e.GET("/wallets/:id", handlers.GetWallet)
	e.POST("/wallets/:id/transactions", handlers.AddTransaction)
	e.GET("/wallets/:id/transactions", handlers.GetTransactions)
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	fmt.Println("Server running on port", port)
	e.Start(":" + port)
}