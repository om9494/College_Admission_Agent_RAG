from chroma_utils import vectorstore


# Fetch all stored documents and their embeddings
data = vectorstore._collection.get()

# Access the embeddings
embeddings = data['embeddings']

# Print the first few embeddings
print(embeddings[:5])  # Display a sample of embeddings