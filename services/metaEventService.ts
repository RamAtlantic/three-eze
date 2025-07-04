import axios from 'axios';

interface MetaEventData {
  event_name: string;
  event_time: number;
  action_source: string;
  user_data: {
    em: string[];
  };
  custom_data: {
    currency: string;
    value: string;
  };
}

export async function sendMetaEvent(email: string, value: string = "10"): Promise<boolean> {
  console.log('🚀 Iniciando envío de evento a Meta...');
  console.log('📧 Email:', email);
  console.log('💰 Valor:', value);
  
  try {
    const eventData: MetaEventData = {
      event_name: "Purchase",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      user_data: {
        em: ["7b17fb0bd173f625b58636fb796407c22b3d16fc78302d79f0fd30c2fc2fc068"]
      },
      custom_data: {
        currency: "USD",
        value: value
      }
    };

    console.log('📊 Event data preparado:', eventData);

    const accessToken = process.env.NEXT_PUBLIC_META_ACCESS_TOKEN;
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
    
    console.log('🔧 Variables de entorno:');
    console.log('  - Endpoint:', endpoint ? '✅ Configurado' : '❌ No configurado');
    console.log('  - Access Token:', accessToken ? '✅ Configurado' : '❌ No configurado');
    console.log('  - Pixel ID:', pixelId ? '✅ Configurado' : '❌ No configurado');
    
    if (!endpoint) {
      throw new Error('Endpoint no configurado');
    }

    if (!accessToken) {
      throw new Error('Access Token no configurado');
    }

    if (!pixelId) {
      throw new Error('Pixel ID no configurado');
    }

    const payload = {
      eventData,
      accessToken,
      pixelId
    };

    console.log('📤 Enviando payload a:', endpoint);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });

    console.log('✅ Evento enviado exitosamente:', response.data);
    return true;
  } catch (error: any) {
    console.error('❌ Error enviando evento a Meta:');
    console.error('  - Tipo de error:', error.name);
    console.error('  - Mensaje:', error.message);
    console.error('  - Response status:', error.response?.status);
    console.error('  - Response data:', error.response?.data);
    console.error('  - Stack:', error.stack);
    return false;
  }
} 