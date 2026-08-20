from typing import List

def chunk_text(text: str, max_chunk_chars: int = 6000, overlap_chars: int = 500) -> List[str]:
    """
    Splits long text cleanly along paragraphs or sentence boundaries.
    """
    clean_text = text.strip()
    if len(clean_text) <= max_chunk_chars:
        return [clean_text]

    chunks = []
    paragraphs = clean_text.split("\n\n")
    current_chunk: List[str] = []
    current_length = 0

    for para in paragraphs:
        para_len = len(para) + 2
        if current_length + para_len > max_chunk_chars and current_chunk:
            combined = "\n\n".join(current_chunk)
            chunks.append(combined)
            # Retain overlap for contextual continuity
            tail = combined[-overlap_chars:] if len(combined) > overlap_chars else ""
            current_chunk = [tail, para] if tail else [para]
            current_length = len(tail) + para_len
        else:
            current_chunk.append(para)
            current_length += para_len

    if current_chunk:
        chunks.append("\n\n".join(current_chunk))

    return chunks
