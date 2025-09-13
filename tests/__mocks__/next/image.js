module.exports = {
  __esModule: true,
  default: (props) => {
    const img = document.createElement('img')
    img.src = props.src || ''
    img.alt = props.alt || ''
    img.className = props.className || ''
    img.style = props.style || {}
    return img
  },
}
