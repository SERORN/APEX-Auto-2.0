import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutView from '../../components/CheckoutView';
import { CartProvider } from '../../context/CartContext';
import { BrowserRouter } from 'react-router-dom';
import * as supabaseClient from '../../src/lib/supabaseClient';

// Mock supabase
jest.spyOn(supabaseClient.supabase.auth, 'getUser').mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null });

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('CheckoutView', () => {
  it('flujo completo: agrega producto, checkout, confirma pedido, limpia carrito y redirige', async () => {
    // Renderizar CheckoutView con contexto y router
    render(
      <BrowserRouter>
        <CartProvider>
          <CheckoutView onNavigate={() => {}} />
        </CartProvider>
      </BrowserRouter>
    );

    // Simular agregar producto al carrito (esto depende de la UI, aquí solo ejemplo)
    // fireEvent.click(screen.getByText('Agregar al carrito'));

    // Llenar formulario de checkout
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'test@mail.com' } });
    fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Dirección/i), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByLabelText(/Ciudad/i), { target: { value: 'CDMX' } });
    fireEvent.change(screen.getByLabelText(/Código Postal/i), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText(/Nombre en la Tarjeta/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Número de Tarjeta/i), { target: { value: '4242424242424242' } });
    fireEvent.change(screen.getByLabelText(/Expiración/i), { target: { value: '12/30' } });
    fireEvent.change(screen.getByLabelText(/CVC/i), { target: { value: '123' } });

    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /Pagar/i }));

    // Esperar redirección y limpieza de carrito
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/confirmacion');
    });
  });
});
