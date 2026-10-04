# Tips

## Line links to rendered files on GitHub

GitHub renders Markdown (and some other formats, like notebooks), so `#L13` on a normal blob URL does not jump to a line. Add `?plain=1` before the anchor:

```
https://github.com/<owner>/<repo>/blob/<sha>/docs/design.md?plain=1#L13
```

Code files (`.go`, `.ts`, `.yaml`, ...) do not need it.
