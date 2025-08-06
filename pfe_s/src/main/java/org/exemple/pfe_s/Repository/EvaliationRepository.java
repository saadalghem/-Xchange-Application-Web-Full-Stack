package org.exemple.pfe_s.Repository;


import org.exemple.pfe_s.Entity.Evaliation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EvaliationRepository extends JpaRepository<Evaliation, Long> {

    List<Evaliation> findByUtilisateurNoteeId(Long utilisateurNoteeId);

    Optional<Evaliation> findByUtilisateurNoteurIdAndProduitId(Long utilisateurNoteurId, Long produitId);

    List<Evaliation> findByProduitId(Long produitId);

    List<Evaliation> findByUtilisateurNoteurId(Long id);
}
