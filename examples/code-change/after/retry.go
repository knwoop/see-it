package fetch

import (
	"context"
	"errors"
	"net/http"
	"time"
)

const maxAttempts = 5

var ErrRetriesExhausted = errors.New("fetch: retries exhausted")

// Get fetches url, retrying on network errors and 5xx responses.
func Get(ctx context.Context, c *http.Client, url string) (*http.Response, error) {
	backoff := 100 * time.Millisecond
	for attempt := 0; attempt < maxAttempts; attempt++ {
		req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
		if err != nil {
			return nil, err
		}
		resp, err := c.Do(req)
		if err == nil && resp.StatusCode < 500 {
			return resp, nil
		}
		if resp != nil {
			resp.Body.Close()
		}
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case <-time.After(backoff):
		}
		backoff *= 2
	}
	return nil, ErrRetriesExhausted
}
