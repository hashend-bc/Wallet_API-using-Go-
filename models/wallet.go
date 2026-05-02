package models

type Wallet struct {
	ID      string    `json:"id" gorm:"primaryKey"`
	Name    string    `json:"name"`
	Balance float64   `json:"balance"`
	Transactions []Transaction `json:"transactions" gorm:"foreignKey:WalletID"`
}

type Transaction struct {
	ID        string  `json:"id" gorm:"primaryKey"`
	Type   string  `json:"type"`   // credit / debit
	Amount float64 `json:"amount"`
	WalletID string  `json:"wallet_id"`
}
