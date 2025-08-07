from transformers import BartTokenizer as Tokenizer, BartForConditionalGeneration as Model
import torch

print("LOADING MODEL, THIS WILL TAKE YOUR MOM'S WEIGHT seconds to load")

tokenizer = Tokenizer.from_pretrained("facebook/bart-base")
model = Model.from_pretrained("facebook/bart-base")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = model.to(device)

print(f"MODEL LOADED AND MOVED TO DEVICE {device}")

def get_model():
    return tokenizer, model, device