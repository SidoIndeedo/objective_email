from model import get_model
from modes import Modes
import torch

tokenizer, model, device = get_model()

def summarize(text: str, mode: str = "professional") -> str:
    prompt = Modes.get(mode, Modes["professional"])
    full_input = f"{prompt}\n{text}"

    inputs = tokenizer(full_input, return_tensors="pt", max_length=1000, truncation=True)
    input_ids = inputs["input_ids"].to(device)
    attention_mask = inputs["attention_mask"].to(device)

    summary_ids = model.generate(
        input_ids,
        attention_mask=attention_mask,
        num_beams=4,
        max_length=200,
        min_length=30,
        early_stopping=True
    )

    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

#summarize()
