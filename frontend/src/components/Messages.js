import React, { useState } from 'react';

const Messages = ({ user }) => {
	const [activeChat, setActiveChat] = useState(null);
	const [newMessage, setNewMessage] = useState('');

	// Mensajes simulados para demostración rápida
	const [conversations] = useState([
		{
			id: 1,
			contact: {
				id: 2,
				fullName: 'Juan Pérez',
				lastSeen: new Date()
			},
			messages: [
				{ id: 1, senderId: 2, text: 'Hola, estoy interesado en tu propiedad', timestamp: new Date(Date.now() - 3600000) },
				{ id: 2, senderId: user.id, text: '¡Hola! ¿Qué propiedad te interesa?', timestamp: new Date(Date.now() - 3500000) },
				{ id: 3, senderId: 2, text: 'El apartamento en Madrid', timestamp: new Date(Date.now() - 3400000) }
			],
			unread: 1
		},
		{
			id: 2,
			contact: {
				id: 3,
				fullName: 'María López',
				lastSeen: new Date(Date.now() - 86400000)
			},
			messages: [
				{ id: 4, senderId: user.id, text: 'Buenos días, quería consultar sobre el pago', timestamp: new Date(Date.now() - 172800000) },
				{ id: 5, senderId: 3, text: 'Claro, dime qué necesitas saber', timestamp: new Date(Date.now() - 172700000) }
			],
			unread: 0
		}
	]);

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (!newMessage.trim()) return;

		// Aquí iría la lógica real para enviar el mensaje
		console.log('Mensaje enviado:', newMessage);
		setNewMessage('');
	};

	return (
		<div className="messages-page">
			<h1>Mensajes</h1>

			<div className="messages-container">
				<div className="conversations-list">
					{conversations.map(conversation => (
						<div
							key={conversation.id}
							className={`conversation-item ${activeChat === conversation.id ? 'active' : ''}`}
							onClick={() => setActiveChat(conversation.id)}
						>
							<div className="contact-avatar">
								{conversation.contact.fullName.charAt(0)}
							</div>
							<div className="conversation-info">
								<div className="contact-name">
									{conversation.contact.fullName}
									{conversation.unread > 0 && (
										<span className="unread-badge">{conversation.unread}</span>
									)}
								</div>
								<p className="last-message">
									{conversation.messages[conversation.messages.length - 1].text}
								</p>
							</div>
							<div className="conversation-time">
								{new Date(conversation.messages[conversation.messages.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
							</div>
						</div>
					))}

					{conversations.length === 0 && (
						<div className="empty-conversations">
							<p>No tienes conversaciones</p>
						</div>
					)}
				</div>

				<div className="chat-window">
					{activeChat ? (
						<>
							<div className="chat-header">
								<div className="contact-info">
									<div className="contact-avatar">
										{conversations.find(c => c.id === activeChat).contact.fullName.charAt(0)}
									</div>
									<div className="contact-details">
										<p className="contact-name">
											{conversations.find(c => c.id === activeChat).contact.fullName}
										</p>
										<p className="contact-status">
											Último acceso: {new Date(conversations.find(c => c.id === activeChat).contact.lastSeen).toLocaleString()}
										</p>
									</div>
								</div>
							</div>

							<div className="chat-messages">
								{conversations.find(c => c.id === activeChat).messages.map(message => (
									<div
										key={message.id}
										className={`message ${message.senderId === user.id ? 'sent' : 'received'}`}
									>
										<div className="message-content">
											{message.text}
										</div>
										<div className="message-time">
											{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
										</div>
									</div>
								))}
							</div>

							<form className="message-form" onSubmit={handleSendMessage}>
								<input
									type="text"
									placeholder="Escribe un mensaje..."
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
								/>
								<button type="submit" className="send-btn">Enviar</button>
							</form>
						</>
					) : (
						<div className="no-chat-selected">
							<p>Selecciona una conversación para comenzar</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Messages;