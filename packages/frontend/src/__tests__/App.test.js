import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Mock fetch for tests
const mockTodos = [
  { id: 1, title: 'Test Todo 1', completed: false },
  { id: 2, title: 'Test Todo 2', completed: true },
];

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockTodos),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders TODO App heading', async () => {
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  const headingElement = await screen.findByText(/TODO App/i);
  expect(headingElement).toBeInTheDocument();
});

test('displays todos from API', async () => {
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
  });

  expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
});

test('calculates stats correctly', async () => {
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('1 items left')).toBeInTheDocument();
  });

  expect(screen.getByText('1 completed')).toBeInTheDocument();
});

test('shows empty state when no todos', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  );

  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
  });
});

test('deletes a todo', async () => {
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
  });

  // Mock successful delete - set before clicking
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    })
  );

  // Find and click delete button by aria-label
  const deleteButtons = screen.getAllByLabelText('delete todo');
  fireEvent.click(deleteButtons[0]);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});

test('edits a todo', async () => {
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
  });

  // Find and click edit button by aria-label
  const editButtons = screen.getAllByLabelText('edit todo');
  fireEvent.click(editButtons[0]);

  // Verify edit mode is active
  await waitFor(() => {
    expect(screen.getByDisplayValue('Test Todo 1')).toBeInTheDocument();
  });

  // Update title
  const inputField = screen.getByDisplayValue('Test Todo 1');
  fireEvent.change(inputField, { target: { value: 'Updated Todo' } });

  // Mock successful update
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 1, title: 'Updated Todo', completed: false }),
    })
  );

  // Save changes
  const saveButton = screen.getByRole('button', { name: /save/i });
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/1'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated Todo' }),
      })
    );
  });
});

test('handles API errors gracefully', async () => {
  global.fetch = jest.fn(() =>
    Promise.reject(new Error('API Error'))
  );

  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
