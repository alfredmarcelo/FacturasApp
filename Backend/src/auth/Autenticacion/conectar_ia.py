from langchain_ollama import ChatOllama
from langchain_core.tools import StructuredTool # <--- Importante
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import create_tool_calling_agent, AgentExecutor
import ollama

# 1. DEFINE LA FUNCIÓN LIMPIA (Sin @tool)
def obtener_Productos(query: str) -> str:
    """
    Busca productos en la base de datos basándose en una consulta del usuario.
    Útil para encontrar precios, stock o detalles de habichuelas, laptops, etc.
    """
    print(f"\n--- 🔎 Buscando en DB: {query} ---")
    
    try:
        # Tu lógica de Qdrant...
        response = ollama.embeddings(model="nomic-embed-text", prompt=query)
        embedding = response["embedding"]
        
        # Simulación de resultado (sustituye con tu client.query_points real)
        # resultado = client.query_points(...)
        
        # Simulo retorno para que el código funcione sin DB real conectada
        return f"Resultado de la DB para '{query}': Tenemos Habichuelas marca 'El Campo' a $50."
        
    except Exception as e:
        return f"Error: {str(e)}"

# 2. CONVIERTE LA FUNCIÓN EN TOOL MANUALMENTE
# Esto evita el error de la "tupla"
mi_tool_manual = StructuredTool.from_function(
    func=obtener_Productos,
    name="obtener_Productos",
    description="Busca productos, precios y stock en la base de datos."
)

# 3. EL AGENTE
def llamar_IA(prompt_usuario):
    
    llm = ChatOllama(model='llama3.1', temperature=0)

    # Agregamos la tool creada manualmente a la lista
    tools = [mi_tool_manual]

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "Eres un asistente de ventas útil."),
        ("user", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ])

    agent = create_tool_calling_agent(llm, tools, prompt_template)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

    try:
        response = agent_executor.invoke({"input": prompt_usuario})
        return response['output']
    except Exception as e:
        return f"Error ejecutando agente: {e}"

# --- EJECUCIÓN ---
print(llamar_IA('Necesito precio de habichuelas'))