import gradio as gr
import os
from dotenv import load_dotenv
from Ace_Model_RAG.main import chat, upload_and_index_document, list_documents, delete_document, provide_feedback
from Ace_Model_RAG.pydantic_models import QueryInput, ModelName, FeedbackInput, DeleteFileRequest
import uuid
import logging

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(filename='app.log', level=logging.INFO)

# Gradio Interface
def gradio_chat(question, session_id=None, model=ModelName.GPT4_O_MINI):
    if not session_id:
        session_id = str(uuid.uuid4())
    
    query_input = QueryInput(question=question, session_id=session_id, model=model)
    response = chat(query_input)
    return response.answer, response.session_id

def gradio_upload(file):
    if file is not None:
        response = upload_and_index_document(file)
        return response
    return "No file uploaded"

def gradio_list_docs():
    return list_documents()

def gradio_delete_doc(file_id):
    delete_request = DeleteFileRequest(file_id=file_id)
    return delete_document(delete_request)

def gradio_feedback(session_id, feedback):
    feedback_input = FeedbackInput(session_id=session_id, feedback=feedback)
    return provide_feedback(feedback_input)

with gr.Blocks() as demo:
    gr.Markdown("# Ace-RAG-LLM Chatbot")
    with gr.Tab("Chat"):
        chatbot = gr.Chatbot()
        with gr.Row():
            question_input = gr.Textbox(label="Question")
            session_id_input = gr.Textbox(label="Session ID", interactive=True, visible=True)
            submit_button = gr.Button("Submit")
        submit_button.click(gradio_chat, [question_input, session_id_input], [chatbot, session_id_input])
    with gr.Tab("Upload"):
        file_upload = gr.File(label="Upload Document")
        upload_button = gr.Button("Upload")
        upload_output = gr.Textbox(label="Upload Output")
        upload_button.click(gradio_upload, file_upload, upload_output)
    with gr.Tab("List"):
        list_button = gr.Button("List Documents")
        list_output = gr.Dataframe(label="List of Documents")
        list_button.click(gradio_list_docs, [], list_output)
    with gr.Tab("Delete"):
        delete_input = gr.Number(label="File ID to Delete")
        delete_button = gr.Button("Delete")
        delete_output = gr.Textbox(label="Delete Output")
        delete_button.click(gradio_delete_doc, delete_input, delete_output)
    with gr.Tab("Feedback"):
        feedback_session_id = gr.Textbox(label="Session ID")
        feedback_input = gr.Radio(["yes", "no"], label="Feedback")
        feedback_button = gr.Button("Submit Feedback")
        feedback_output = gr.Textbox(label="Feedback Output")
        feedback_button.click(gradio_feedback, [feedback_session_id, feedback_input], feedback_output)

demo.launch()
