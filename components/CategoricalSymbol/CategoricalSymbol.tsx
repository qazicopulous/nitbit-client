import styles from './CategoricalSymbol.module.css'

interface CategoricalSymbolProps {
  for: string,
  small?: boolean,
  dark?: boolean
  onClick?: () => void
}

interface Category {
  class: string;
  symbol: string;
}

const Categories: Record<string, Category> = {
  Release: {
    class: styles.release,
    symbol: 'R',
  },
  Devlog: {
    class: styles.devlog,
    symbol: 'D',
  },
  Notes: {
    class: styles.notes,
    symbol: 'N',
  },
};

const CategoricalSymbol: React.FC<CategoricalSymbolProps> = ({ for: category, small, dark, onClick }) => {
  return (
    <div
      className={`${styles["categorical-symbol"]} ${small ? styles.small : ''} ${ dark ? styles.dark : ''} ${Categories[category].class}`}
      onClick={ onClick }
    >
      {small ? "" : Categories[category].symbol}
    </div>
  );

}

export default CategoricalSymbol;