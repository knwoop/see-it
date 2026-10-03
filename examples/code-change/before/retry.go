package fetch

import (
	"net/http"
	"time"
)

const maxAttempts = 3

// Get fetches url, retrying on any error.
func Get(c *http.Client, url string) (*http.Response, error) {
	var lastErr error
	for attempt := 0; attempt < maxAttempts; attempt++ {
		resp, err := c.Get(url)
		if err == nil {
			return resp, nil
		}
		lastErr = err
		time.Sleep(time.Second)
	}
	return nil, lastErr
}
