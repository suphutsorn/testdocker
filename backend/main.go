package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// WebSocket Upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // อนุญาตทุก Origin
	},
}

// เก็บการเชื่อมต่อ
var clients = make(map[string]map[*websocket.Conn]bool) // map[room]connections
var broadcast = make(chan Message)

// Message โครงสร้างข้อความ
type Message struct {
	Room    string `json:"room"`
	Sender  string `json:"sender"`
	Content string `json:"content"`
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading:", err)
		return
	}
	defer conn.Close()

	room := r.URL.Query().Get("room") // ดึง Room จาก Query Params
	if room == "" {
		log.Println("Room is required")
		return
	}

	if clients[room] == nil {
		clients[room] = make(map[*websocket.Conn]bool)
	}
	clients[room][conn] = true

	// รับข้อความจาก Client
	for {
		var msg Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Printf("Error reading message: %v", err)
			delete(clients[room], conn)
			break
		}
		broadcast <- msg
	}
}

func handleMessages() {
	for {
		msg := <-broadcast
		room := msg.Room

		// ส่งข้อความไปยังสมาชิกใน Room
		for conn := range clients[room] {
			err := conn.WriteJSON(msg)
			if err != nil {
				log.Printf("Error sending message: %v", err)
				conn.Close()
				delete(clients[room], conn)
			}
		}
	}
}

func main() {
	http.HandleFunc("/ws", handleConnections)

	go handleMessages()

	log.Println("WebSocket server started on :8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
