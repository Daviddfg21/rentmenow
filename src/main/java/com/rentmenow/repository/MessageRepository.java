package com.rentmenow.repository;

import com.rentmenow.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Message
 */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

	// Buscar mensajes por emisor
	List<Message> findBySenderId(Long senderId);

	// Buscar mensajes por receptor
	List<Message> findByReceiverId(Long receiverId);

	// Buscar mensajes no leídos por receptor
	List<Message> findByReceiverIdAndIsReadFalse(Long receiverId);

	// Buscar mensajes sobre una propiedad
	List<Message> findByPropertyId(Long propertyId);

	// Obtener conversación entre dos usuarios
	@Query("SELECT m FROM Message m WHERE " + "(m.sender.id = :user1Id AND m.receiver.id = :user2Id) OR "
			+ "(m.sender.id = :user2Id AND m.receiver.id = :user1Id) " + "ORDER BY m.createdAt ASC")
	List<Message> findConversationBetweenUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);

	// Obtener mensajes no leídos en una conversación
	@Query("SELECT m FROM Message m WHERE " + "((m.sender.id = :user1Id AND m.receiver.id = :user2Id) OR "
			+ "(m.sender.id = :user2Id AND m.receiver.id = :user1Id)) AND "
			+ "m.receiver.id = :receiverId AND m.isRead = false " + "ORDER BY m.createdAt ASC")
	List<Message> findUnreadMessagesInConversation(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id,
			@Param("receiverId") Long receiverId);

	// Contar mensajes no leídos
	long countByReceiverIdAndIsReadFalse(Long receiverId);

	// Obtener últimos mensajes por usuario (conversaciones activas)
	@Query("SELECT m FROM Message m WHERE m.id IN (" + "SELECT MAX(m2.id) FROM Message m2 WHERE "
			+ "(m2.sender.id = :userId OR m2.receiver.id = :userId) "
			+ "GROUP BY CASE WHEN m2.sender.id = :userId THEN m2.receiver.id ELSE m2.sender.id END"
			+ ") ORDER BY m.createdAt DESC")
	List<Message> findLatestMessagesByUser(@Param("userId") Long userId);

	// Buscar mensajes por contenido
	@Query("SELECT m FROM Message m WHERE " + "LOWER(m.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND "
			+ "(m.sender.id = :userId OR m.receiver.id = :userId) " + "ORDER BY m.createdAt DESC")
	List<Message> findByContentContainingAndUserId(@Param("searchTerm") String searchTerm,
			@Param("userId") Long userId);
}