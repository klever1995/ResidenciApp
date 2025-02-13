package models

type Property struct {
	ID          int     `json:"id"`
	Title       string  `json:"title"`
	Address     string  `json:"address"`
	OwnerID     int     `json:"owner_id"`
	Price       float64 `json:"price"`
	Description string  `json:"description"`
	IsAvailable string  `json:"is_available"`
	Image       []byte  `json:"image"`
	City        string  `json:"city"`
	CreatedAt   string  `json:"created_at"`
	UpdatedAt   string  `json:"updated_at"`
}
