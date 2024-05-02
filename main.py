#mi import fastapi per creare il backend in python
from fastapi import FastAPI, HTTPException
#per richieste standardizzate
from pydantic import BaseModel
#per connessione
import mysql.connector
#per evitare errori di CORS
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#sempre per cors
# Middleware per gestire le intestazioni CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#file di configurazione per connessione
config = {
    "host" : "127.0.0.1",
    "port" : "3306", #standard
    "user" : "root",
    "database" : "ristorante"
}

class check_tavolo(BaseModel):
    data: str
    ora: str
    
class prenota_tavolo(BaseModel):
    data: str
    ora: str
    numero_persone: int

#rotta check tavoli
@app.get("/api/check_tavolo")
def check_tavolo(check_tavolo:check_tavolo):
    conn = mysql.connector.connect(**config) # host = config#host
    cursor  = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tavoli WHERE data=%s AND ora=%s" , (check_tavolo.data, check_tavolo.ora))
    #fetchall restituisce una lista degli utenti trovati
    tavoli = cursor.fetchall()
    print(tavoli)
    if not tavoli:
        raise HTTPException(status_code=200, detail="Tavolo Libero")
    else : 
        raise HTTPException(status_code=401, detail="Tavolo Occupato")

    
#la rotta di prenotazione tavoli
@app.post("/api/prenota")
def registrazione(prenota_tavolo : prenota_tavolo):
    conn = mysql.connector.connect(**config) # host = config#host
    cursor  = conn.cursor()
    cursor.execute("INSERT INTO tavoli (data, ora, numero_persone) VALUES (%s,%s,%s)" 
                   , (prenota_tavolo.data, prenota_tavolo.ora, prenota_tavolo.numero_persone))
    conn.commit()
    conn.close()
    raise HTTPException(status_code=201, detail="Tavolo Prenotato")

