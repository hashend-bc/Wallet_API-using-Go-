package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/google/uuid"

	"wallet-api/models"
	"wallet-api/store"
)

func CreateWallet(c echo.Context) error {

	var input struct {
		Name string `json:"name"`
	}

	if err := c.Bind(&input); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	if input.Name == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Name is required"})
	}

	wallet := &models.Wallet{
		ID:           uuid.New().String(),
		Name:         input.Name,
		Balance:      0,
		Transactions: []models.Transaction{},
	}

	// ✅ Save to Pebble
	if err := store.SaveWallet(wallet); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to save wallet"})
	}

	return c.JSON(http.StatusCreated, wallet)
}

func GetWallet(c echo.Context) error {

	id := c.Param("id")

	wallet, err := store.GetWallet(id)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Wallet not found"})
	}

	return c.JSON(http.StatusOK, wallet)
}

func AddTransaction(c echo.Context) error {

	id := c.Param("id")

	wallet, err := store.GetWallet(id)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Wallet not found"})
	}

	var input struct {
		Type   string  `json:"type"`
		Amount float64 `json:"amount"`
	}

	if err := c.Bind(&input); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	if input.Type == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Transaction type is required"})
	}

	if input.Amount <= 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Transaction amount must be positive"})
	}

	// ✅ Business logic
	if input.Type == "credit" {
		wallet.Balance += input.Amount
	} else if input.Type == "debit" {
		if wallet.Balance < input.Amount {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Insufficient balance"})
		}
		wallet.Balance -= input.Amount
	} else {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid transaction type"})
	}

	tx := models.Transaction{
		ID:     uuid.New().String(),
		Type:   input.Type,
		Amount: input.Amount,
	}

	wallet.Transactions = append(wallet.Transactions, tx)

	// ✅ Save updated wallet
	if err := store.SaveWallet(wallet); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update wallet"})
	}

	return c.JSON(http.StatusOK, wallet)
}

func GetTransactions(c echo.Context) error {

	id := c.Param("id")

	wallet, err := store.GetWallet(id)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Wallet not found"})
	}

	limit, _ := strconv.Atoi(c.QueryParam("limit"))
	offset, _ := strconv.Atoi(c.QueryParam("offset"))

	if limit == 0 {
		limit = 5
	}

	start := offset
	end := offset + limit

	if start > len(wallet.Transactions) {
		start = len(wallet.Transactions)
	}

	if end > len(wallet.Transactions) {
		end = len(wallet.Transactions)
	}

	return c.JSON(http.StatusOK, wallet.Transactions[start:end])
}