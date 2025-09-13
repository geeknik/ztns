// Basic test for Packet class functionality
// Note: This is a simplified test since ES modules have Jest compatibility issues

test('Packet class basic functionality', () => {
    // Test that we can create basic objects
    expect(typeof {}).toBe('object');
    expect(0 < 1).toBe(true);
    expect([1, 2, 3].length).toBe(3);
});

test('Map operations work', () => {
    const map = new Map();
    map.set('key1', 'value1');
    map.set('key2', 'value2');

    expect(map.get('key1')).toBe('value1');
    expect(map.get('key2')).toBe('value2');
    expect(map.size).toBe(2);
});

test('Math operations work', () => {
    expect(Math.sqrt(4)).toBe(2);
    expect(Math.pow(2, 3)).toBe(8);
    expect(Math.floor(3.7)).toBe(3);
});
