import React, { useState, useRef, useEffect } from 'react';
import './CopilotPanel.css';

// Respuestas simuladas del Copilot según la entrada del usuario
const generateCopilotResponse = (prompt) => {
  const lower = prompt.toLowerCase();

  if (lower.includes('hola') || lower.includes('buenos') || lower.includes('buenas')) {
    return '¡Hola! Soy Copilot, tu asistente de IA para Microsoft Dynamics 365. Puedo ayudarte con análisis de datos, resúmenes de operaciones y automatización de tareas. ¿En qué te puedo ayudar hoy?';
  }

  if (lower.includes('reporte') || lower.includes('informe')) {
    return 'Puedo generar un reporte personalizado. Para crear uno, dime:\n\n• ¿Qué módulo te interesa? (Finanzas, Supply Chain, etc.)\n• ¿Qué periodo necesitas?\n• ¿Qué métricas específicas quieres ver?\n\nEjemplo: "Muéstrame las ventas del último trimestre por región"';
  }

  if (lower.includes('venta') || lower.includes('ingreso') || lower.includes('revenue')) {
    return '📊 Resumen de ventas (Q1 2026):\n\n• Ingresos totales: $4,055,678\n• Crecimiento vs Q4: +12.3%\n• Top cliente: Contoso Corp ($485K)\n• Margen promedio: 34.5%\n\n¿Te gustaría un desglose por producto, región o vendedor?';
  }

  if (lower.includes('inventario') || lower.includes('stock') || lower.includes('almacen')) {
    return '📦 Estado del inventario:\n\n• Total items: 12,847\n• Valor total: $2.3M\n• Items con stock bajo: 23\n• Items sin movimiento (+90 días): 156\n\nRecomiendo revisar las alertas de stock bajo en el módulo de Supply Chain.';
  }

  if (lower.includes('cliente') || lower.includes('customer')) {
    return '👥 Top 5 clientes por ingresos:\n\n1. Contoso Corp - $485,230\n2. Adventure Works - $412,890\n3. Fabrikam Inc. - $356,100\n4. Northwind Traders - $298,450\n5. Wide World Importers - $245,670\n\n¿Quieres que genere un plan de acción para retener al Top 3?';
  }

  if (lower.includes('flujo') || lower.includes('cash') || lower.includes('efectivo')) {
    return '💰 Flujo de efectivo (proyectado):\n\n• Saldo actual: $1,250,000\n• Ingresos esperados (30 días): $890,000\n• Egresos proyectados: $720,000\n• Saldo final estimado: $1,420,000\n\nLa proyección es positiva. ¿Quieres ver el detalle por categoría?';
  }

  if (lower.includes('proyecto') || lower.includes('project')) {
    return '📋 Resumen de proyectos activos:\n\n• Total: 18 proyectos\n• En tiempo: 12 (66%)\n• En riesgo: 4 (22%)\n• Retrasados: 2 (12%)\n\nLos proyectos en riesgo requieren atención inmediata. ¿Quieres ver el detalle?';
  }

  if (lower.includes('empleado') || lower.includes('rh') || lower.includes('hr')) {
    return '👥 Recursos Humanos:\n\n• Total empleados: 247\n• Nuevos este mes: 8\n• Vacaciones activas: 12\n• Evaluaciones pendientes: 34\n\nTodo está dentro de los parámetros normales.';
  }

  if (lower.includes('predic') || lower.includes('pronostico') || lower.includes('forecast')) {
    return '🔮 Pronóstico IA - Próximo trimestre:\n\n• Ingresos estimados: $4.8M - $5.1M\n• Confianza: 87%\n• Tendencia: Positiva 📈\n\nBasado en patrones históricos y estacionalidad detectada.';
  }

  if (lower.includes('gracias') || lower.includes('thanks')) {
    return '¡De nada! Estoy aquí para ayudarte. Si necesitas algo más, solo pregunta. ✨';
  }

  // Respuesta por defecto
  return `Entendido: "${prompt}"\n\nPuedo ayudarte con:\n\n📊 Reportes y análisis de datos\n💰 Información financiera y de ventas\n📦 Estado de inventarios y供应链\n👥 Datos de clientes y empleados\n📋 Estado de proyectos\n🔮 Predicciones y pronósticos\n\n¿Sobre qué módulo te gustaría profundizar?`;
};

const SUGGESTIONS = [
  { icon: '📊', text: 'Muéstrame las ventas del trimestre' },
  { icon: '📦', text: 'Estado del inventario' },
  { icon: '💰', text: 'Flujo de efectivo proyectado' },
  { icon: '👥', text: 'Top 5 clientes por ingresos' },
  { icon: '🔮', text: 'Pronóstico de ventas próximo mes' },
  { icon: '📋', text: 'Resumen de proyectos activos' },
];

const CopilotPanel = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy Copilot, tu asistente de IA. ¿En qué puedo ayudarte hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, thinking]);

  const handleSend = (text = null) => {
    const messageText = text || input.trim();
    if (!messageText || thinking) return;

    // Agregar mensaje del usuario
    setMessages((prev) => [...prev, { role: 'user', content: messageText }]);
    setInput('');
    setThinking(true);

    // Simular respuesta del Copilot
    setTimeout(() => {
      const response = generateCopilotResponse(messageText);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setThinking(false);
    }, 800 + Math.random() * 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="copilot-backdrop" onClick={onClose}></div>
      <aside className="copilot-panel">
        <div className="copilot-header">
          <div className="copilot-header-info">
            <div className="copilot-avatar">
              <span>✨</span>
            </div>
            <div>
              <h3>Copilot</h3>
              <span className="copilot-badge">PREVIEW</span>
            </div>
          </div>
          <button className="copilot-close" onClick={onClose} title="Cerrar">
            ✕
          </button>
        </div>

        <div className="copilot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`copilot-message copilot-${msg.role}`}>
              <div className="copilot-message-avatar">
                {msg.role === 'user' ? '👤' : '✨'}
              </div>
              <div className="copilot-message-content">
                {msg.content.split('\n').map((line, i) => (
                  <p key={i}>{line || '\u00A0'}</p>
                ))}
              </div>
            </div>
          ))}

          {thinking && (
            <div className="copilot-message copilot-assistant">
              <div className="copilot-message-avatar">✨</div>
              <div className="copilot-message-content">
                <div className="copilot-thinking">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="copilot-suggestions">
            <p className="suggestions-title">Sugerencias:</p>
            <div className="suggestions-grid">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="suggestion-chip"
                  onClick={() => handleSend(s.text)}
                >
                  <span className="suggestion-icon">{s.icon}</span>
                  <span>{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="copilot-input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregúntale algo a Copilot..."
            rows={2}
            disabled={thinking}
          />
          <button
            className="copilot-send"
            onClick={() => handleSend()}
            disabled={!input.trim() || thinking}
            title="Enviar (Enter)"
          >
            ➤
          </button>
        </div>
      </aside>
    </>
  );
};

export default CopilotPanel;
