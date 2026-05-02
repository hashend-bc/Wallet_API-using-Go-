package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/labstack/echo/v4"
)

type Client struct {
	Count     int
	LastReset time.Time
}

var clients = make(map[string]*Client)
var mu sync.Mutex

const limit = 5 // requests per minute

func RateLimiter(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {

		ip := c.RealIP()

		mu.Lock()

		client, exists := clients[ip]

		if !exists {
			clients[ip] = &Client{
				Count:     1,
				LastReset: time.Now(),
			}
			mu.Unlock()
			return next(c)
		}

		// reset after 1 minute
		if time.Since(client.LastReset) > time.Minute {
			client.Count = 0
			client.LastReset = time.Now()
		}

		if client.Count >= limit {
			mu.Unlock()
			return c.JSON(http.StatusTooManyRequests, map[string]string{
				"error": "Rate limit exceeded",
			})
		}

		client.Count++
		mu.Unlock()

		return next(c)
	}
}