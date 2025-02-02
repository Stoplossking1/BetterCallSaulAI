from datasets import load_dataset

dataset = load_dataset("rishabbahal/quebecois_canadian_french_dataset")
print(dataset)
print(dataset["train"].column_names)
