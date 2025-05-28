package com.rentmenow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;

/**
 * Entidad Message - Representa mensajes del chat entre usuarios
 */
@Entity
@Table(name = "messages")
@EntityListeners(AuditingEntityListener.class)
public class Message {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sender_id", nullable = false)
	@JsonBackReference("sender-messages")
	private User sender;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "receiver_id", nullable = false)
	@JsonBackReference("receiver-messages")
	private User receiver;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "property_id", nullable = true) // Opcional, mensajes sobre una propiedad específica
	private Property property;

	@NotBlank
	@Size(max = 1000)
	@Column(nullable = false, columnDefinition = "TEXT")
	private String content;

	@Column(nullable = false)
	private Boolean isRead = false;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private MessageType type = MessageType.TEXT;

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	// Enum para tipo de mensaje
	public enum MessageType {
		TEXT, // Mensaje de texto
		SYSTEM, // Mensaje del sistema
		NOTIFICATION // Notificación
	}

	// Constructores
	public Message() {
	}

	public Message(User sender, User receiver, String content) {
		this.sender = sender;
		this.receiver = receiver;
		this.content = content;
	}

	public Message(User sender, User receiver, Property property, String content) {
		this.sender = sender;
		this.receiver = receiver;
		this.property = property;
		this.content = content;
	}

	// Getters y Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getSender() {
		return sender;
	}

	public void setSender(User sender) {
		this.sender = sender;
	}

	public User getReceiver() {
		return receiver;
	}

	public void setReceiver(User receiver) {
		this.receiver = receiver;
	}

	public Property getProperty() {
		return property;
	}

	public void setProperty(Property property) {
		this.property = property;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Boolean getIsRead() {
		return isRead;
	}

	public void setIsRead(Boolean isRead) {
		this.isRead = isRead;
	}

	public MessageType getType() {
		return type;
	}

	public void setType(MessageType type) {
		this.type = type;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	@Override
	public String toString() {
		return "Message{" + "id=" + id + ", content='" + content.substring(0, Math.min(content.length(), 50)) + "..."
				+ '\'' + ", isRead=" + isRead + ", type=" + type + ", createdAt=" + createdAt + '}';
	}
}