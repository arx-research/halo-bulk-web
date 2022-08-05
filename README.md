# Bulk HaLo Scanner

This tool lets you quickly scan and save HaLo information across a large set of chips using an NFC enabled smartphone. The chip information can then be exported to a `.json` file.

# Usage

The webpage must be loaded via an SSL encrypted domain for scanning to function; e.g. `https://bulk.vrfy.ch`. Tap the "Scan" button and hold a HaLo chip to the NFC antenna on your smartphone to scan.

# TODOs

- [ ] Store chip signature of recent blockhash, address or content hash.
- [ ] Add fields to allow naming of `.json` file and associate content.
- [ ] Use WebNFC APIs on Android Chrome.
