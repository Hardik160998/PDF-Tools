INSERT INTO public.categories (id, name, icon, sort_order, is_active) VALUES
(1, 'Organize', 'SlidersHorizontal', 2, true),
(2, 'Optimize', 'Zap', 3, true),
(3, 'Convert', 'RefreshCw', 4, true),
(4, 'Edit', 'Pencil', 5, true),
(5, 'Security', 'ShieldCheck', 6, true),
(6, 'Special', 'Star', 7, true),
(7, 'Sign', 'PenTool', 8, true),
(10, 'Image Convert', 'ImageIcon', 9, true),
(11, 'Ecommerce', 'LayoutGrid', 9, true);

-- Important: Update the sequence so that new insertions get the correct ID
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM public.categories));
