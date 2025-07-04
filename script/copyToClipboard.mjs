import { spawn } from 'child_process'

export async function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    const platform = process.platform
    let proc

    if (platform === 'darwin') {
      proc = spawn('pbcopy')
    } else if (platform === 'win32') {
      proc = spawn('clip')
    } else {
      // Linux (assumes xclip installed)
      proc = spawn('xclip', ['-selection', 'clipboard'])
    }

    proc.on('error', (err) => {
      reject(new Error(`Failed to copy to clipboard: ${err.message}`))
    })

    proc.stdin.write(text)
    proc.stdin.end()

    proc.on('close', () => resolve())
  })
}
