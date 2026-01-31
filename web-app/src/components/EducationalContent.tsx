import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Bookmark } from 'lucide-react';
import '../styles/content.css';

const CONTENT_DATA = {
  id: 'root',
  title: 'Sexual & Reproductive Health',
  content: 'Comprehensive educational resources about sexual health, reproductive options, and evidence-based health information.',
  children: [
    {
      id: 'contraception',
      title: 'Contraception Methods',
      content: 'Comprehensive guide to different contraception options including pills, IUDs, implants, and more. Learn about effectiveness, side effects, and how to choose the right method for you.',
      children: [
        { id: 'bc-pills', title: 'Birth Control Pills', content: 'Information about hormonal contraceptive pills and how they work.' },
        { id: 'iud', title: 'IUDs', content: 'Everything you need to know about intrauterine devices.' },
        { id: 'implant', title: 'Implants', content: 'Guide to contraceptive implants and their effectiveness.' },
      ]
    },
    {
      id: 'menstruation',
      title: 'Menstruation & Periods',
      content: 'Learn about the menstrual cycle, period variations, and what is normal. Includes information on cycle tracking and understanding your body.',
      children: [
        { id: 'cycle-basics', title: 'Cycle Basics', content: 'Understanding the phases of your menstrual cycle.' },
        { id: 'period-products', title: 'Period Products', content: 'Guide to different menstrual products and how to use them.' },
        { id: 'irregular-periods', title: 'Irregular Periods', content: 'What causes irregular periods and when to see a doctor.' },
      ]
    },
    {
      id: 'stis',
      title: 'STIs & Testing',
      content: 'Information about sexually transmitted infections, testing, treatment, and prevention. Comprehensive guide to safe sexual practices.',
      children: [
        { id: 'sti-types', title: 'Types of STIs', content: 'Overview of common sexually transmitted infections.' },
        { id: 'testing', title: 'Testing & Treatment', content: 'How to get tested and treatment options.' },
        { id: 'prevention', title: 'Prevention', content: 'How to protect yourself and your partners.' },
      ]
    },
    {
      id: 'abortion',
      title: 'Abortion Information',
      content: 'Evidence-based, non-judgmental information about abortion options. Learn about medication abortion, surgical procedures, and resources.',
      children: [
        { id: 'abortion-options', title: 'Abortion Options', content: 'Medical and surgical abortion procedures explained.' },
        { id: 'abortion-resources', title: 'Resources & Support', content: 'Where to find help and support services.' },
      ]
    },
    {
      id: 'pregnancy',
      title: 'Pregnancy Information',
      content: 'Comprehensive information about pregnancy, including options available to you and resources for support.',
    },
    {
      id: 'relationships',
      title: 'Sex & Relationships',
      content: 'Guide to healthy relationships, communication, consent, and sexual health.',
    },
  ]
};

interface ContentItemProps {
  item: any;
  onSelectItem: (item: any) => void;
}

const ContentItemComponent: React.FC<ContentItemProps> = ({ item, onSelectItem }) => {
  const { isBookmarked, toggleBookmark } = useAppStore();
  const bookmarked = isBookmarked(item.id);

  return (
    <div className="content-item" onClick={() => onSelectItem(item)}>
      <div className="item-header">
        <h3>{item.title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(item.id);
          }}
          className="bookmark-button"
        >
          <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
        </button>
      </div>
      {item.content && <p className="preview">{item.content.substring(0, 100)}...</p>}
      {item.children && item.children.length > 0 && (
        <div className="child-count">{item.children.length} topics</div>
      )}
    </div>
  );
};

export const EducationalContent: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState(CONTENT_DATA);
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([CONTENT_DATA]);
  const { isBookmarked } = useAppStore();
  const bookmarked = isBookmarked(selectedItem.id);

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setBreadcrumbs([...breadcrumbs, item]);
  };

  const handleBreadcrumb = (index: number) => {
    setSelectedItem(breadcrumbs[index]);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
  };

  const handleBack = () => {
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = breadcrumbs.slice(0, -1);
      setSelectedItem(newBreadcrumbs[newBreadcrumbs.length - 1]);
      setBreadcrumbs(newBreadcrumbs);
    }
  };

  return (
    <div className="educational-content">
      <div className="breadcrumb">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={item.id}>
            <button
              onClick={() => handleBreadcrumb(index)}
              className="breadcrumb-link"
            >
              {item.title}
            </button>
            {index < breadcrumbs.length - 1 && <span> / </span>}
          </React.Fragment>
        ))}
      </div>

      <div className="content-view">
        <div className="content-header">
          <h2>{selectedItem.title}</h2>
          <button
            onClick={() => {
              useAppStore().toggleBookmark(selectedItem.id);
            }}
            className="bookmark-button large"
          >
            <Bookmark size={24} fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        {selectedItem.content && (
          <div className="content-body">
            <p>{selectedItem.content}</p>
          </div>
        )}

        {selectedItem.children && selectedItem.children.length > 0 && (
          <div className="children-section">
            <h3>Topics</h3>
            <div className="children-list">
              {selectedItem.children.map((child: any) => (
                <ContentItemComponent
                  key={child.id}
                  item={child}
                  onSelectItem={handleSelectItem}
                />
              ))}
            </div>
          </div>
        )}

        {breadcrumbs.length > 1 && (
          <button onClick={handleBack} className="back-button">
            ← Back
          </button>
        )}
      </div>
    </div>
  );
};
