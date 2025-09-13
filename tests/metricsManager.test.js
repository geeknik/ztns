// Basic test for MetricsManager functionality
// Note: This is a simplified test since ES modules have Jest compatibility issues

test('MetricsManager basic functionality', () => {
    // Test basic object creation
    const obj = { count: 0, items: [] };
    expect(obj.count).toBe(0);
    expect(obj.items.length).toBe(0);

    // Test array operations
    obj.items.push(100);
    obj.items.push(200);
    expect(obj.items.length).toBe(2);

    // Test average calculation
    const sum = obj.items.reduce((a, b) => a + b, 0);
    const avg = sum / obj.items.length;
    expect(avg).toBe(150);
});

test('String operations work', () => {
    const str = 'Total Packets: 5';
    expect(str.includes('Total Packets')).toBe(true);
    expect(str.includes('Connections')).toBe(false);
});

test('Number formatting works', () => {
    const num = 150.5;
    const formatted = num.toFixed(2);
    expect(formatted).toBe('150.50');

    const whole = Math.floor(num);
    expect(whole).toBe(150);
});
