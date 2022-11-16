import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom/extend-expect";
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import Layout from './layout';

beforeAll(() => render(<Layout />))

test('layout contains elements', async () => {
    expect(screen.getByRole('main')).toBeVisible();
    expect(screen.getByRole('sidenav')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'sidenav-toggle' })).toBeVisible()
});

test('sidenav starts open', async () => {
    expect(screen.getByRole('sidenav')).toBeVisible();
});

test('sidenav starts open', async () => {
    userEvent.click(screen.getByRole('button', { name: 'sidenav-toggle' }))
    expect(screen.getByRole('sidenav')).toBeVisible();
});