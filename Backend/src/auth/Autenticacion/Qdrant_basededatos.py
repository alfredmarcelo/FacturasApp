from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue, models
import ollama
from langchain_ollama import ChatOllama
from langchain.agents import create_agent
from langchain.tools import tool
from langchain.messages import HumanMessage
from langchain_core.prompts import ChatPromptTemplate
import uuid

ollama_cliente = ollama.Client(host='localhost')
client = QdrantClient(url="http://localhost:6333")


def Convertir_embeddings(prompt):

    convertir_embeddings = ollama_cliente.embeddings(model='nomic-embed-text', prompt=prompt)
    embeddings = convertir_embeddings['embedding']
    return embeddings

def Crear_collecion(Coleccion_nombre, texto, negocio_id):
    
    embeddings = Convertir_embeddings(texto)

    if not client.collection_exists(Coleccion_nombre):
        client.create_collection(collection_name=Coleccion_nombre, vectors_config=models.VectorParams(size=len(embeddings), distance=models.Distance.COSINE))
    
    client.upsert(
    collection_name=Coleccion_nombre,
    points=[models.PointStruct(id=uuid.uuid4(), vector=embeddings, payload={"negocio_id": negocio_id, "text": texto})],
    )



# @tool
# def obtener_Productos(query: str) -> dict:
#     """
#     Busca productos en la base vectorial y devuelve coincidencias con distancia.
#     """
#     response = ollama.embeddings(
#         model="nomic-embed-text",
#         prompt=query
#     )

#     embedding = response["embedding"]

#     resultado = client.query_points(
#         collection_name="Productos",
#         query=embedding,
#         limit=5,
#         with_payload=True
#     )

#     items = []
#     for punto in resultado.points:
#         items.append({
#             "producto": punto.payload,
#             "score": punto.score
#         })

#     return {
#         "query": query,
#         "items": items
#     }

# @tool
# def Info_ComprobanteFiscal(query):
#     """ Provee informacion sobre comprobantes fiscales de la Republica Dominicana """

#     response = ollama.embeddings(
#         model="nomic-embed-text",
#         prompt=query
#     )

#     embedding = response["embedding"]

#     resultado = client.query_points(
#         collection_name="Comprobante Fiscal",
#         query=embedding,
#         limit=5,
#         with_payload=True
#     )

#     items = []
#     for punto in resultado.points:
#         items.append({
#             "info": punto.payload,
#             "score": punto.score
#         })
#     return {
#         "query": query,
#         "items": items
#     }

# def llamar_IA(prompt):

#     model = ChatOllama(
#         model='qwen3:14b',
#         temperature=0,
#     )

#     tools = [obtener_Productos, Info_ComprobanteFiscal]

#     agente = create_agent(
#         model=model,
#         tools=tools,
#         system_prompt='Se breve con las respuestas a menos que se necesiten mas detalles en la respuesta'
#     )

#     result = agente.invoke({'messages': [HumanMessage(content=prompt)]})

#     return result


# resultado = llamar_IA('Que son los comprobantes fiscales o E-CF?')

# print(resultado['messages'][-1].content)