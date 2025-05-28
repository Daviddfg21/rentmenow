package com.rentmenow.service;

import com.rentmenow.model.Message;
import com.rentmenow.model.Property;
import com.rentmenow.model.User;
import com.rentmenow.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Servicio para gestión de mensajes del chat
 */
@Service
public class MessageService {

	@Autowired
	private MessageRepository messageRepository;

	@Autowired
	private UserService userService;

	@Autowired
	private PropertyService propertyService;

	// Obtener todos los mensajes
	public List<Message> getAllMessages() {
		return messageRepository.findAll();
	}

	// Obtener mensaje por ID
	public Optional<Message> getMessageById(Long id) {
		return messageRepository.findById(id);
	}

	// Enviar mensaje entre usuarios
	public Message sendMessage(Long senderId, Long receiverId, String content) {
		User sender = userService.getUserById(senderId).orElseThrow(() -> new RuntimeException("Emisor no encontrado"));

		User receiver = userService.getUserById(receiverId)
				.orElseThrow(() -> new RuntimeException("Receptor no encontrado"));

		Message message = new Message(sender, receiver, content);
		return messageRepository.save(message);
	}

	// Enviar mensaje sobre una propiedad específica
	public Message sendMessage(Long senderId, Long receiverId, Long propertyId, String content) {
		User sender = userService.getUserById(senderId).orElseThrow(() -> new RuntimeException("Emisor no encontrado"));

		User receiver = userService.getUserById(receiverId)
				.orElseThrow(() -> new RuntimeException("Receptor no encontrado"));

		Property property = propertyService.getPropertyById(propertyId)
				.orElseThrow(() -> new RuntimeException("Propiedad no encontrada"));

		Message message = new Message(sender, receiver, property, content);
		return messageRepository.save(message);
	}

	// Obtener conversación entre dos usuarios
	public List<Message> getConversation(Long user1Id, Long user2Id) {
		return messageRepository.findConversationBetweenUsers(user1Id, user2Id);
	}

	// Obtener mensajes enviados por un usuario
	public List<Message> getMessagesBySender(Long senderId) {
		return messageRepository.findBySenderId(senderId);
	}

	// Obtener mensajes recibidos por un usuario
	public List<Message> getMessagesByReceiver(Long receiverId) {
		return messageRepository.findByReceiverId(receiverId);
	}

	// Obtener mensajes no leídos de un usuario
	public List<Message> getUnreadMessages(Long receiverId) {
		return messageRepository.findByReceiverIdAndIsReadFalse(receiverId);
	}

	// Marcar mensaje como leído
	public Message markMessageAsRead(Long messageId) {
		return messageRepository.findById(messageId).map(message -> {
			message.setIsRead(true);
			return messageRepository.save(message);
		}).orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
	}

	// Marcar todos los mensajes de una conversación como leídos
	public void markConversationAsRead(Long user1Id, Long user2Id, Long receiverId) {
		List<Message> unreadMessages = messageRepository.findUnreadMessagesInConversation(user1Id, user2Id, receiverId);

		for (Message message : unreadMessages) {
			message.setIsRead(true);
			messageRepository.save(message);
		}
	}

	// Obtener mensajes sobre una propiedad específica
	public List<Message> getMessagesByProperty(Long propertyId) {
		return messageRepository.findByPropertyId(propertyId);
	}

	// Eliminar mensaje
	public void deleteMessage(Long id) {
		if (!messageRepository.existsById(id)) {
			throw new RuntimeException("Mensaje no encontrado");
		}
		messageRepository.deleteById(id);
	}

	// Contar mensajes no leídos de un usuario
	public long countUnreadMessages(Long receiverId) {
		return messageRepository.countByReceiverIdAndIsReadFalse(receiverId);
	}

	// Obtener conversaciones activas de un usuario (últimos mensajes)
	public List<Message> getActiveConversations(Long userId) {
		return messageRepository.findLatestMessagesByUser(userId);
	}

	// Buscar mensajes por contenido
	public List<Message> searchMessages(String searchTerm, Long userId) {
		return messageRepository.findByContentContainingAndUserId(searchTerm, userId);
	}
}