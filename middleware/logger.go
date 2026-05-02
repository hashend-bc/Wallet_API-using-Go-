package middleware

import (
	"fmt"
	"github.com/labstack/echo/v4"
)

func Logger(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		fmt.Printf("Request: %s %s\n", c.Request().Method, c.Request().URL)
		return next(c)
	}
}