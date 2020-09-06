package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	apiGroup := router.Group("/api")

	apiGroup.GET("/", func(c *gin.Context) {
		c.Writer.Write([]byte("rj-site-novel/back-end"))
	})

	router.Run(":80")
}
