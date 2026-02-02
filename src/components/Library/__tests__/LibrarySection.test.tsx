import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LibrarySection } from '../LibrarySection';
import { Album } from '../../../mockData';

const mockAlbums: Album[] = [
  {
    id: '1',
    title: 'Test Album',
    artist: 'Test Artist',
    coverUrl: 'http://example.com/cover.jpg',
  },
];

describe('LibrarySection', () => {
  it('renders title and action label', () => {
    render(<LibrarySection title="Test Section" items={mockAlbums} actionLabel="Test Action" />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Test Action')).toBeInTheDocument();
  });

  it('renders album items', () => {
    render(<LibrarySection title="Test Section" items={mockAlbums} />);
    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('calls onItemClick when album is clicked', () => {
    const onItemClick = jest.fn();
    render(<LibrarySection title="Test Section" items={mockAlbums} onItemClick={onItemClick} />);
    
    // Click on the album card container
    // finding by text returns the h3, closest gets the container
    const albumTitle = screen.getByText('Test Album');
    const card = albumTitle.closest('div.group');
    fireEvent.click(card!);
    
    expect(onItemClick).toHaveBeenCalledWith(mockAlbums[0]);
  });

  it('calls onActionClick when action button is clicked', () => {
    const onActionClick = jest.fn();
    render(<LibrarySection title="Test Section" items={mockAlbums} actionLabel="Click Me" onActionClick={onActionClick} />);
    fireEvent.click(screen.getByText('Click Me'));
    expect(onActionClick).toHaveBeenCalled();
  });
});
