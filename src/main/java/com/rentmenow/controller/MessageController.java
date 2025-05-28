package com.rentmenow.controller;

import com.rentmenow.model.Message;
import com.rentmenow.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST para gestión de mensajes del chat
 */
@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class MessageController {

	@Autowired
	private MessageService messageService;

	// GET /api/messages - Obtener todos los mensajes
	@GetMapping
	public ResponseEntity<List<Message>> getAllMessages() {
		List<Message> messages = messageService.getAllMessages();
		return ResponseEntity.ok(messages);
	}

	// GET /api/messages/{id} - Obtener mensaje por ID
	@GetMapping("/{id}")
	public ResponseEntity<Message> getMessageById(@PathVariable Long id) {
		return messageService.getMessageById(id).map(message -> ResponseEntity.ok(message))
				.orElse(ResponseEntity.notFound().build());
	}

	// POST /api/messages - Enviar nuevo mensaje
	@PostMapping
	public ResponseEntity<Message> sendMessage(@RequestParam Long senderId, @RequestParam Long receiverId,
			@RequestParam String content, @RequestParam(required = false) Long propertyId) {
		try {
			Message message;
			if (propertyId != null) {
				message = messageService.sendMessage(senderId, receiverId, propertyId, content);
			} else {
				message = messageService.sendMessage(senderId, receiverId, content);
			}
			return ResponseEntity.ok(message);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().build();
		}
	}

	// GET /api/messages/conversation - Obtener conversación entre dos usuarios
	@GetMapping("/conversation")
	public ResponseEntity<List<Message>> getConversation(@RequestParam Long user1Id, @RequestParam Long user2Id) {
		List<Message> messages = messageService.getConversation(user1Id, user2Id);
		return ResponseEntity.ok(messages);
	}

	// GET /api/messages/sent/{senderId} - Mensajes enviados por usuario
	@GetMapping("/sent/{senderId}")
	public ResponseEntity<List<Message>> getMessagesBySender(@PathVariable Long senderId) {
		List<Message> messages = messageService.getMessagesBySender(senderId);
		return ResponseEntity.ok(messages);
	}

	// GET /api/messages/received/{receiverId} - Mensajes recibidos por usuario
	@GetMapping("/received/{receiverId}")
	public ResponseEntity<List<Message>> getMessagesByReceiver(@PathVariable Long receiverId) {
		List<Message> messages = messageService.getMessagesByReceiver(receiverId);
		return ResponseEntity.ok(messages);
	}

	// GET /api/messages/unread/{receiverId} - Mensajes no leídos
	@GetMapping("/unread/{receiverId}")
	public ResponseEntity<List<Message>> getUnreadMessages(@PathVariable Long receiverId) {
		List<Message> messages = messageService.getUnreadMessages(receiverId);
		return ResponseEntity.ok(messages);
	}

	// PUT /api/messages/{id}/read - Marcar mensaje como leído
	@PutMapping("/{id}/read")
	public ResponseEntity<Message> markMessageAsRead(@PathVariable Long id) {
		try {
			Message message = messageService.markMessageAsRead(id);
			return ResponseEntity.ok(message);
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	// PUT /api/messages/conversation/read - Marcar conversación como leída
	@PutMapping("/conversation/read")
	public ResponseEntity<String> markConversationAsRead(@RequestParam Long user1Id, @RequestParam Long user2Id,
			@RequestParam Long receiverId) {
		messageService.markConversationAsRead(user1Id, user2Id, receiverId);
		return ResponseEntity.ok("Conversación marcada como leída");
	}

	// GET /api/messages/property/{propertyId} - Mensajes sobre una propiedad
	@GetMapping("/property/{propertyId}")
	public ResponseEntity<List<Message>> getMessagesByProperty(@PathVariable Long propertyId) {
		List<Message> messages = messageService.getMessagesByProperty(propertyId);
		return ResponseEntity.ok(messages);
	}

	// DELETE /api/messages/{id} - Eliminar mensaje
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
		try {
			messageService.deleteMessage(id);
			return ResponseEntity.ok().build();
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	// GET /api/messages/conversations/{userId} - Conversaciones activas de un
	// usuario
	@GetMapping("/conversations/{userId}")
	public ResponseEntity<List<Message>> getActiveConversations(@PathVariable Long userId) {
		List<Message> messages = messageService.getActiveConversations(userId);
		return ResponseEntity.ok(messages);
	}

	// GET /api/messages/search - Buscar mensajes por contenido
	@GetMapping("/search")
	public ResponseEntity<List<Message>> searchMessages(@RequestParam String searchTerm, @RequestParam Long userId) {
		List<Message> messages = messageService.searchMessages(searchTerm, userId);
		return ResponseEntity.ok(messages);
	}

	// GET /api/messages/unread/count/{receiverId} - Contar mensajes no leídos
	@GetMapping("/unread/count/{receiverId}")
	public ResponseEntity<Map<String, Long>> countUnreadMessages(@PathVariable Long receiverId) {
		long count = messageService.countUnreadMessages(receiverId);
		Map<String, Long> result = Map.of("unreadCount", count);
		return ResponseEntity.ok(result);
	}
}