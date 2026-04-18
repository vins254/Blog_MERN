/**
 * Shared category options for blog posts.
 */
interface Category {
    value: string;
    label: string;
}

const CATEGORIES: Category[] = [
    { value: 'Tech', label: 'Tech' },
    { value: 'Lifestyle', label: 'Lifestyle' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Business', label: 'Business' },
    { value: 'Health', label: 'Health & Fitness' },
    { value: 'Education', label: 'Education' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Food', label: 'Food & Cooking' },
    { value: 'Fashion', label: 'Fashion & Beauty' },
    { value: 'Science', label: 'Science' },
    { value: 'Environment', label: 'Environment' },
    { value: 'Politics', label: 'Politics' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'DIY', label: 'DIY & Crafts' },
    { value: 'Art', label: 'Arts & Culture' },
    { value: 'Photography', label: 'Photography' },
    { value: 'News', label: 'News & Media' },
    { value: 'Other', label: 'Other' },
];

export default CATEGORIES;
